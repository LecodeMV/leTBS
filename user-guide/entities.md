# Entities

## Sprite Configuration

* Notetags:
  ```
    <letbs_sprite>
    chara(pose_name): character_name, character_index, [line_index], [frame_index]
    sprite_name: string
    </letbs_sprite>
  ```
* Altering notetags in-game reload the sprites.
* Custom battle sprites inside `img/letbs/battlers` are automatically detected based on `sprite_name`
  and require no configuration given they are named following this pattern: `spriteName_pose[nbrFrames]`.
  Ex: `Harold_idle[3]`.
* Battle sprites can be static. (Single frame)

## Teams and AI