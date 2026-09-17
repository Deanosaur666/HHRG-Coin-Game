// file constants

const markdownFiles = [
    {
        label: 'Map and setup',
        path:  'Map and setup.md',
        // include: [],
        // includelevel: 1,
        // exclude: [],
        // exludelevel: 1,
        theme: {

        }
    },

    {
        label: 'Rats',
        path:  'Ops and Special Activities.md',
        include: ["Moss Track and Grower", "Rat Ops", "Rat Special Activities"],
        includelevel: 1,
        theme: {
            bg1: "#c00000",
            bg2: "#4e0000",
            text: "#ffffff"
        }
    },
    {
        label: 'Gov',
        path:  'Ops and Special Activities.md',
        include: ["Assassination", "Gov Ops", "Gov Special Activities"],
        includelevel: 1,
        theme: {
            bg1: "rgb(3, 3, 8)",
            bg2: "#00084e",
            text: "#ffffff"
        }
    },
    {
        label: "Propaganda",
        path: "Propaganda Rounds.md",
    },

    {
        label: "Turns and Events",
        path: "Turns and Events.md"
    },

    {
        label: "Shootouts",
        path: "Shootouts.md",
    },
];


const buttonsContainer = document.getElementById('buttons');
const contentContainer = document.getElementById('content');

let activePath = null;

// MD parsing
function parseMarkdown(md) {
  const root = { type: 'root', level: 0, text: '', children: [] };
  const stack = [root];

  const lines = md.split(/\r?\n/);

  for (const line of lines) {
    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*?)\s*#*\s*$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const node = { type: 'heading', level, text, children: [] };

      // Pop until the top of stack has a heading level less than ours.
      while (
        stack.length > 1 &&
        (stack[stack.length - 1].level ?? 0) >= level
      ) {
        stack.pop();
      }

      stack[stack.length - 1].children.push(node);
      stack.push(node);

      continue;
    }

    // Bullet line?
    const bulletMatch = line.match(/^\s*[-*+]\s+(.*)$/);
    if (bulletMatch) {
    const parent = stack[stack.length - 1];
    let list = parent.children[parent.children.length - 1];
    if (!list || list.type !== 'list') {
        list = { type: 'list', text: '', children: [] };
        parent.children.push(list);
    }
    list.children.push({
        type: 'content',
        text: bulletMatch[1],
        children: [],
    });
    continue;
    }

    // Any other line is content under the current heading
    stack[stack.length - 1].children.push({
        type: 'content',
        text: line,
        children: [],
        });
    
  }
  return root;
}

function filterMDTree(root, include, includelevel, exclude, excludelevel) {

    // we only include headings of includelevel if include includes them
    if(include && root.level === includelevel && !include.includes(root.text)) {
        return null;
    }
    else if(exclude && root.level == excludelevel && exclude.includes(root.text)) {
        return null;
    }
    else if (root.children){
        for (let i = 0; i < root.children.length; i ++) {
            root.children[i] = filterMDTree(root.children[i], include, includelevel, exclude, excludelevel)
        }
        root.children = root.children.filter(Boolean)
    }
    return root;
}

function MDTreeStrings(node, depth = 0, isRoot = true) {
  const lines = [];
  if (!isRoot) {
    const indent = '  '.repeat(depth);
    const label =
      node.type === 'heading' ? `h${node.level} ${node.text}` : node.text;
    lines.push(indent + label);
  }
  const nextDepth = isRoot ? 0 : depth + 1;
  for (const child of node.children) {
    lines.push(...MDTreeStrings(child, nextDepth, false));
  }
  return lines;
}

function renderInline(el, text) {
  // Order matters: bold before italic so ** isn't eaten by *
  const html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
  el.innerHTML = html;
}

/**
 * Convert a tree node into a DOM element.
 *
 * - heading nodes  -> <section class="box"> with an <h1>..<h6> title
 * - content nodes  -> <p class="content">
 * - list nodes     -> <ul> with <li> children (if you added list grouping)
 */
function renderNode(node) {
  if (node.type === 'heading') {
    const section = document.createElement('section');
    section.className = `box box-h${node.level}`;

    const heading = document.createElement(`h${node.level}`);
    
    renderInline(heading, node.text);
    section.appendChild(heading);

    for (const child of node.children) {
        section.appendChild(renderNode(child));
    }
    return section;
  }

  if (node.type === 'list') {
    const ul = document.createElement('ul');
    for (const item of node.children) {
      const li = document.createElement('li');
      renderInline(li, item.text);
      ul.appendChild(li);
    }
    return ul;
  }

  // content
  // Horizontal rule: a line of only ---, ***, or ___ (3 or more)
  if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(node.text)) {
    return document.createElement('hr');
  }

  const p = document.createElement('p');
  p.className = 'content';
  renderInline(p, node.text);
  return p;
}

function renderTree(tree, container) {
  container.innerHTML = '';
  for (const child of tree.children) {
    container.appendChild(renderNode(child));
  }
}

// theme
const THEME_MAP = {
    bg1 : "--md-bg-1",
    bg2 : "--md-bg-2",
    text : "--md-text"
}

function applyTheme(theme) {
    // Clear any previously-set variables so a file with no theme
    // (or a smaller theme) doesn't inherit the previous file's colors.
    for (const varName of Object.values(THEME_MAP)) {
        contentContainer.style.removeProperty(varName);
    }
    if (!theme) return;

    for (const [key, value] of Object.entries(theme)) {
        const varName = THEME_MAP[key];
        if (varName && value) {
            contentContainer.style.setProperty(varName, value);
        }
    }
}


// load markdown
async function loadMarkdown(file) {
    try {
        applyTheme(file.theme)
        contentContainer.innerHTML = `<p><em>Loading ${file.label || file.path}...</em></p>`;

        const response = await fetch(file.path);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status} – ${response.statusText}`);
        }

        const rawMarkdown = await response.text();

        console.log(rawMarkdown)

        let tree = parseMarkdown(rawMarkdown);
        MDTreeStrings(tree).forEach((x) => console.log(x))

        tree = filterMDTree(tree, file.include, file.includelevel, file.exclude, file.excludelevel)

        //MDTreeStrings(tree).forEach((x) => console.log(x))

        renderTree(tree, contentContainer);

        activePath = file.path + '|' + (file.label || '');
        updateActiveButton();

    } catch (error) {
        contentContainer.innerHTML =
            `<p class="error">Could not load <strong>${file.path}</strong>: ${error.message}</p>`;
        console.error(error);
    }
}

// buttons
function updateActiveButton() {
    buttonsContainer.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.key === activePath);
    });
}

function buildFileList() {
    markdownFiles.forEach(file => {
        const btn = document.createElement('button');
        btn.textContent  = file.label || file.path;
        btn.dataset.key  = file.path + '|' + (file.label || '');
        btn.title        = file.path;
        btn.addEventListener('click', () => loadMarkdown(file));
        buttonsContainer.appendChild(btn);
    });
}

// setup 
buildFileList();

if (markdownFiles.length > 0) {
    loadMarkdown(markdownFiles[0]);
}