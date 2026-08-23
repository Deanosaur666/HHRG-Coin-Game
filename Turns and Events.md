
If a space is ever reduced to 0 population, set it to neutral.

# Turn track

The game is divided into 3 "campaigns," each with 8 turns and one propaganda round. The turn track is made of 3 rows of 9 spaces, representing campaigns and turns.

The turn marker has two sides. The flipped side indicates that a propaganda round has occurred for this row already. When the turn tracker moves to a new row, it flips back to face up.

| 1    | 2   | 3   | 4   | 5   | 6   | 7                     | 8                     | 9          |
| ---- | --- | --- | --- | --- | --- | --------------------- | --------------------- | ---------- |
|      |     |     |     |     |     | Roll <= 2, propaganda | Roll <= 3, propaganda | Propaganda |
| Flip |     |     |     |     |     | Roll <= 2, propaganda | Roll <= 3, propaganda | Propaganda |
| Flip |     |     |     |     |     | Roll <= 2, propaganda | Roll <= 3, propaganda | Propaganda |
After the third propaganda round occurs, the game ends.

# Turn Procedure
- Event roll
- Armored Car Movement
- Artillery Phase
- Drug Trade Phase
- Player turns/Propaganda Round

# Events

Each turn (except for a turn that automatically triggers propaganda), events are checked before players choose actions. A dice is rolled to determine what event occurs. If this even triggers a propaganda round, events do not occur. Otherwise, consult the table:

| Roll | Result                                                                                       |
| ---- | -------------------------------------------------------------------------------------------- |
| 1    | No effect                                                                                    |
| 2    | Government player moves an additional armored car                                            |
| 3    | Government player moves two additional armored cars.                                         |
| 4    | Initiative player places 1 civilian in a district space without terror or an emergency zone. |
| 5    | Initiative player places 1 gangster in a district space without an emergency zone.           |
| 6    | Trigger a shootout. Initiative player selects the space among valid spaces.                  |

# Armored car movement

After resolving an event, the government player may move an armored car (or more if a 2 or 3 are rolled) down an un-sabotaged LOC. If an armored car reaches a police station, it is removed to available, and the government moves 3 police from out of play to available.

Whenever an armored car moves, a single police cube on its origin space may move with it.

# Artillery Phase

If the artillery strategic center is sabotaged, remove any artillery target markers on the map.
If the artillery marker is in a space and on its red (active) side, the ray artillery fires.
If the artillery target marker is in a space and on its blue (warning) side, flip it to the red (active) side.

**Firing**
The government player removes all pieces from the space (civilians and gangsters to government collateral), and set the space to neutral, then places sabotage and terror in that space.
If the target space is a foreign space, shift the moss down once and lose one political will.
If the target space is at support, lose one political will.

# Drug Trade Phase
If the moss grower is not on the map, set Rats profit marker to zero.
Otherwise, increase the rats profit marker by the number of civilians and gangsters in the moss grower space.
If the profit marker is equal or higher to the next target value on the moss track, increase the moss track by one (or lower political will by 1 if the track is already at maximum) and then subtract that value from profits.

# Initiative track.

Each turn, in eligibility order, each player may pick limited op, economic action, or ops + special activities.