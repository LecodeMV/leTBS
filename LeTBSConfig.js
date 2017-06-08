Lecode.S_TBS.Config = {};


/*-------------------------------------------------------------------------
* Sprites Poses
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Battler_Sprites = {

    // Config_name: data
    "Default": [
        // [pose_name,filename,frames]
        ["idle", "_idle", 3],
        ["dead", "_dead", 1]
    ],

    "Angela": [
        ["idle", "_idle", 1],
        ["move", "_move", 4],
        ["cast", "_cast", 1],
        ["atk", "_atk", 4],
        ["hit", "_hit", 1],
        ["dead", "_dead", 1],
        ["turn_start", "_victory", 5],
        ["victory", "_victory", 5]
    ],

    "Duran": [
        ["idle", "_idle", 1],
        ["move", "_move", 4],
        ["cast", "_cast", 3],
        ["atk", "_atk", 4],
        ["hit", "_hit", 1],
        ["dead", "_dead", 1]
    ],

    "Rabbit": [
        ["idle", "_idle", 1],
        ["move", "_move", 3],
        ["atk", "_atk", 3],
        ["hit", "_hit", 1],
        ["dead", "_dead", 1]
    ],

    "Mago": [
        ["idle", "_idle", 1],
        ["move", "_move", 3],
        ["cast", "_cast", 2],
        ["atk", "_atk", 4],
        ["hit", "_hit", 1],
        ["dead", "_dead", 1]
    ],

    "Evil Statue": [
        ["idle", "_idle", 1],
        ["cast", "_cast", 3],
        ["atk", "_cast", 3],
        ["dead", "_dead", 1]
    ]

};

/*-------------------------------------------------------------------------
* Tile effects
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Tile_Effects = {

    50: {
        "entering,turn_start,turn_end": {
            skill_effects: 50,
            play_anim: true,
            aoe: "circle(0)",
            stop_movement: true,
            wait: 40
        }
    },

    51: {
        "entering": {
            skill_effects: 51,
            play_anim: true,
            aoe: "circle(0)",
            stop_movement: true,
            wait: 40
        },
        "leaving": {
            skill_effects: 52,
            play_anim: true,
            aoe: "circle(0)",
            stop_movement: false,
            wait: 40
        }
    },

    52: {
        "entering": {
            skill_effects: 50,
            play_anim: true,
            aoe: "circle(2)",
            stop_movement: true,
            wait: 40
        }
    },

    53: {
        "entering": {
            skill_effects: 53,
            play_anim: true,
            aoe: "circle(1)",
            stop_movement: true,
            wait: 40
        }
    }

};

/*-------------------------------------------------------------------------
* Marks
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Marks = {

    "explosive_mark": {
        body_anim: 139,
        disappearing_anim: 140,
        size: "square(1)",
        triggers: {
            "turn_end": {
                stop_movement: false,
                skill_effects: 32,
                effects_aoe: "circle(0)"
            }
        },
        max: 1,
        duration: [3, "turn_end"]
    },

    "volcano_cell": {
        body_anim: 143,
        size: "circle(0)",
        triggers: {
            "stepping, turn_start, turn_end": {
                stop_movement: false,
                skill_effects: 24,
                effects_aoe: "circle(0)"
            }
        },
        duration: [3, "turn_end"]
    },

    "magic_trap": {
        body_anim: 145,
        disappearing_anim: 146,
        size: "circle(0)",
        triggers: {
            "stepping": {
                stop_movement: true,
                skill_effects: 36,
                effects_aoe: "circle(0)"
            }
        },
        max_triggers: 1,
        duration: [100, "turn_end"]
    },

    "crystal_mark": {
        body_anim: 157,
        disappearing_anim: 158,
        size: "square(2)",
        triggers: {
            "stepping": {
                stop_movement: false,
                skill_effects: 45,
                effects_aoe: "circle(0)"
            }
        }
    },

    "anti_crystal_mark": {
        body_anim: 160,
        disappearing_anim: 161,
        size: "square(2)",
        triggers: {
            "stepping": {
                stop_movement: false,
                skill_effects: 47,
                effects_aoe: "circle(0)"
            }
        }
    },

    "mago_mark": {
        body_anim: 171,
        disappearing_anim: 172,
        size: "square(1)",
        triggers: {
            "turn_end": {
                stop_movement: false,
                skill_effects: 32,
                effects_aoe: "circle(0)"
            }
        },
        max: 1,
        duration: [3, "turn_end"]
    },

};

/*-------------------------------------------------------------------------
* Aura
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Aura = {

    "intimidating_aura": {
        size: "circle(1)",
        affect_caster: false,
        target_type: "enemy",
        states: [13],
        trigger_anim: 142
    }

};

/*-------------------------------------------------------------------------
* Projectiles
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Projectiles = {

    "bow_arrow": {
        filename: "Arrow",
        adapt_angle: true,
        speed: 5,
        jump: 150
    },

    "ghost_arrow": {
        anim: [137, 36, 16],
        adapt_angle: true,
        speed: 9,
        jump: 0
    },

    "fire_ball": {
        anim: [147, 45, 38],
        adapt_angle: true,
        speed: 9,
        jump: 0
    },

    "fire_arrow": {
        anim: [152, 36, 16],
        adapt_angle: true,
        speed: 9,
        jump: 0
    },

    "phantom_slash": {
        anim: [149, 56, 50],
        adapt_angle: true,
        speed: 9,
        jump: 0
    },

    "great_wind": {
        anim: [168, 56, 50],
        adapt_angle: true,
        speed: 14,
        jump: 0
    },

};

/*-------------------------------------------------------------------------
* Summons
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Summons = {

    "ice_block": {
        active: false,
        kind: "enemy",
        id: 12,
        body_anim: [163,164,165,166],
        tied_to_caster: false,
        stats: {
            mhp: "+30%"
        }
    },

    "wind_spirit": {
        active: true,
        turn_order: "after_caster",
        visible_in_timeline: true,
        type: "user_playable",
        kind: "actor",
        id: 10,
        tied_to_caster: true,
        stats: {
            default: "90%",
            mhp: "70%",
            mmp: "+10%"
        }
    },

    "pyra": {
        active: true,
        turn_order: "after_caster",
        visible_in_timeline: true,
        type: "ai_playable",
        kind: "enemy",
        id: 7,
        tied_to_caster: true,
        stats: {
        }
    },

    "pixie": {
        active: true,
        turn_order: "after_caster",
        visible_in_timeline: true,
        type: "ai_playable",
        kind: "actor",
        id: 11,
        tied_to_caster: true,
        stats: {
            default: "90%",
            mhp: "60%",
            mmp: "+10%"
        }
    },

    "fire_chicken": {
        active: true,
        turn_order: "after_caster",
        visible_in_timeline: true,
        type: "ai_playable",
        kind: "actor",
        id: 12,
        tied_to_caster: false,
        stats: {
            default: "90%",
            mhp: "15%"
        }
    },
};

/*-------------------------------------------------------------------------
* Custom Scopes
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Custom_Scopes = {

    "fire_storm": {
        data: "[cx,cy-2],[cx-1,cy-1],[cx+1,cy-1],[cx-2,cy],[cx+2,cy],[cx-1,cy+1],[cx+1,cy+1],[cx,cy+2]"
    },

    "rush": {
        data: "[cx+3,cy],[cx-3,cy],[cx,cy+3],[cx,cy-3]"
    },

    "volcano_ground": {
        data: "[cx-2,cy-2],[cx,cy-2],[cx+2,cy-2],[cx-1,cy-1],[cx+1,cy-1],[cx-2,cy],[cx+2,cy],[cx-1,cy+1],[cx+1,cy+1],[cx-2,cy+2],[cx,cy+2],[cx+2,cy+2]"
    },

    "fire_ball": {
        data: "[cx,cy+1],[cx-1,cy+2],[cx,cy+2],[cx+1,cy+2],[cx-2,cy+3],[cx-1,cy+3],[cx,cy+3],[cx+1,cy+3],[cx+2,cy+3],[cx-3,cy+4],[cx-2,cy+4],[cx-1,cy+4],[cx,cy+4],[cx+1,cy+4],[cx+2,cy+4],[cx+3,cy+4],[cx-4,cy+5],[cx-3,cy+5],[cx-2,cy+5],[cx-1,cy+5],[cx,cy+5],[cx+1,cy+5],[cx+2,cy+5],[cx+3,cy+5],[cx+4,cy+5],[cx-5,cy+6],[cx-4,cy+6],[cx-3,cy+6],[cx-2,cy+6],[cx-1,cy+6],[cx,cy+6],[cx+1,cy+6],[cx+2,cy+6],[cx+3,cy+6],[cx+4,cy+6],[cx+5,cy+6]"
    },

    "ice_fury": {
        data_right: "[cx,cy],[cx+1,cy],[cx+2,cy]",
        data_left: "[cx-2,cy],[cx-1,cy],[cx,cy]",
        data_up: "[cx,cy-2],[cx,cy-1],[cx,cy]",
        data_down: "[cx,cy],[cx,cy+1],[cx,cy+2]"
    },

    "fire_arrows": {
        data_right: "[cx+2,cy-2],[cx+1,cy-1],[cx+2,cy-1],[cx,cy],[cx+1,cy],[cx+2,cy],[cx+1,cy+1],[cx+2,cy+1],[cx+2,cy+2]",
        data_left: "[cx-2,cy-2],[cx-2,cy-1],[cx-1,cy-1],[cx-2,cy],[cx-1,cy],[cx,cy],[cx-2,cy+1],[cx-1,cy+1],[cx-2,cy+2]",
        data_up: "[cx-2,cy-2],[cx-1,cy-2],[cx,cy-2],[cx+1,cy-2],[cx+2,cy-2],[cx-1,cy-1],[cx,cy-1],[cx+1,cy-1],[cx,cy]",
        data_down: "[cx,cy],[cx-1,cy+1],[cx,cy+1],[cx+1,cy+1],[cx-2,cy+2],[cx-1,cy+2],[cx,cy+2],[cx+1,cy+2],[cx+2,cy+2]"
    },

    "ice_wall": {
        data_right: "[cx,cy-1],[cx,cy],[cx,cy+1]",
        data_left: "[cx,cy-1],[cx,cy],[cx,cy+1]",
        data_up: "[cx-1,cy],[cx,cy],[cx+1,cy]",
        data_down: "[cx-1,cy],[cx,cy],[cx+1,cy]"
    },

    "ice_prison": {
        data: "[cx-1,cy-1],[cx,cy-1],[cx+1,cy-1],[cx-1,cy],[cx+1,cy],[cx-1,cy+1],[cx,cy+1],[cx+1,cy+1]"
    }

};

/*-------------------------------------------------------------------------
* Sequences
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Sequences = {

    /*-------------------------------------------------------------------------
    * Events Sequences
    -------------------------------------------------------------------------*/

    "battle_start": [

    ],

    "turn_start": [
        "play_pose: user, turn_start"
    ],

    "victory": [
        "play_pose: user, victory, victory"
    ],

    "dead": [
        "anim: user, collapse_anim",
        "play_pose: user, dead, dead",
        "wait: 40"
        //"perform_collapse: user"
    ],

    "dead_no_loop": [
        "anim: user, collapse_anim",
        "play_pose: user, dead",
        "set_frame: user, dead, last",
        "wait: 40"
    ],

    "dead_vanish": [
        "play_pose: user, dead",
        "anim: user, collapse_anim",
        "set_frame: user, dead, last",
        "wait: 20",
        "sprite_prop: user, opacity, 0"
    ],

    "revived": [
        "sprite_prop: user, opacity, 255",
        "play_pose: user, idle, idle",
    ],

    "damaged": [
        "sprite_shake: user, 6, 30",
        "play_pose: user, hit",
        "set_frame: user, hit, last",
        "wait: 5",
        "play_pose: user, idle"
    ],

    "evaded": [

    ],

    "healed": [

    ],

    "buffed": [

    ],

    "weakened": [

    ],

    /*-------------------------------------------------------------------------
    * Default Action Sequences
    -------------------------------------------------------------------------*/

    "atk": [
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "cast(loop)": [
        "play_pose: user, cast, cast",
        "wait: 4",
        "map_anim: user_cell, 123, 0, true"
    ],

    "pre-skill": [
        "call: cast(loop)",
        "wait: 4",
        "play_pose: user, atk, wait",
        "set_frame: user, atk, last",
        "wait: 2"
    ],

    "post-skill": [
        "wait: 10",
        "play_pose: user, idle",
        "wait: 10"
    ],

    "skill": [
        "call: pre-skill",
        "effects: {aoe}_battlers, current_obj, obj_anim, 0, true",
        "call: post-skill"
    ],

    "map_skill": [
        "call: pre-skill",
        "map_effects: {aoe}, current_obj, obj_anim, 0, true",
        "call: post-skill"
    ],

    "item": [
        "play_pose: user, item",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "skill_neutral": [
        "play_pose: user, cast",
        "wait: 15",
        "effects: {aoe}_battlers, current_obj, obj_anim, 0, true",
        "play_pose: user, idle",
        "wait: 20"
    ],

    "map_skill_neutral": [
        "play_pose: user, cast",
        "wait: 15",
        "map_effects: {aoe}, current_obj, obj_anim, 0, true",
        "play_pose: user, idle",
        "wait: 20"
    ],

    "bow": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: bow_arrow, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],
    
    "projectile": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: $1, user_cell, {aoe}",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "counter": [
        "anim: user, 177, 0, true",
        "wait: 15"
    ],

    "summon": [
        "call: pre-skill",
        "map_anim: {aoe}, obj_anim",
        "wait: 15",
        "summon: $1, {aoe}",
        "call: post-skill"
    ],

    /*-------------------------------------------------------------------------
    * Your Sequences
    -------------------------------------------------------------------------*/

    "repulsive_blow": [
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "set_speed: {aoe}_battlers, +6",
        "push: {aoe}_battlers, user_cell, 1",
        "set_speed: {aoe}_battlers, reset",
        "wait: 60"
    ],

    "bolt_jump": [
        "set_frame: user, atk, 0",
        "wait: 15",
        "jump_to_cell: user, cursor_cell",
        "play_pose: user, atk",
        "map_effects: {aoe}-user_cell, current_obj, obj_anim"
    ],

    "rush": [
        "wait: 10",
        "set_frame: user, atk, 0",
        "wait: 30",
        "play_pose: user, atk",
        "directional_anim: user, user, 131, 132, 133, 134",
        "look_at: user, cursor_cell",
        "set_speed: user, +6",
        "move_straight: user, 2",
        "set_speed: user, reset",
        "set_frame: user, atk, last",
        "wait: 12",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 20",
        "play_pose: user, idle",
        "wait: 10"
    ],

    "phantom_slash": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: phantom_slash, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, 153",
        "anim: user, 154",
        "wait: 20",
        "reach_target: user, {aoe}_battlers, back, true",
        "anim: user, 155",
        "look_at: user, {aoe}_battlers",
        "play_pose: user, atk",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    //-

    "spark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "effects: {aoe}_battlers, current_obj",
        "call: post-skill"
    ],

    "lightning_storm": [
        "call: pre-skill",
        "call: lightning_storm_effects, 3",
        "call: post-skill"
    ],

    "lightning_storm_effects": [
        "effects: 1_battlers_in_{aoe}, current_obj, obj_anim",
        "wait: 60"
    ],

    "fire_storm": [
        "call: pre-skill",
        "call: fire_storm_effects, 6",
        "call: post-skill"
    ],

    "fire_storm_effects": [
        "map_effects: 1_random_cells_in_{aoe}, current_obj, obj_anim",
        "wait: 60"
    ],

    "fire_support": [
        "ask_call: fire_support_attack, {circle(1)}_allies -cursor_battler",
        "call: skill"
    ],

    "fire_support_attack": [
        "look_at: user, cursor_cell",
        "call: cast(loop)",
        "wait: 4",
        "call: atk"
    ],

    "volcano_ground": [
        "call: pre-skill",
        "map_anim: {aoe}, obj_anim",
        "wait: 20",
        "mark: volcano_cell, {aoe}",
        "wait: 60",
        "call: post-skill"
    ],

    "walking_fire": [
        "call: pre-skill",
        "call_for_every_cell: walking_fire_dmg, {aoe}, close->far",
        "call: post-skill"
    ],

    "walking_fire_dmg": [
        "map_anim: saved(every_cell), obj_anim",
        "map_effects: saved(every_cell), current_obj, obj_anim",
        "wait: 30"
    ],

    "ice_wall": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 30",
        "summon: ice_block, {aoe}",
        "call: post-skill"
    ],

    "ice_prison": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 30",
        "summon: ice_block, {aoe}",
        "call: post-skill"
    ],

    "witch_escape": [
        "call: pre-skill",
        "anim: user, 129",
        "wait: 40",
        "save_cells: witch_escape_old, user_cell",
        "move_to_cell: user, cursor_cell, true",
        "anim: user, 130",
        "wait: 60",
        "set_cursor: saved(witch_escape_old)",
        "look_at: user, cursor_cell",
        "use_skill: user, 19"
    ],


    //-

    "heal": [
        "call: pre-skill",
        "anim: {aoe}_battlers, obj_anim",
        "wait: 20",
        "effects: {aoe}_battlers, current_obj",
        "call: post-skill"
    ],

    "teleportation": [
        "call: pre-skill",
        "anim: user, 129",
        "wait: 40",
        "move_to_cell: user, cursor_cell, true",
        "anim: user, 130",
        "wait: 60",
        "call: post-skill"
    ],

    "salvation": [
        "call: pre-skill",
        "anim: user, obj_anim",
        "pull: {aoe}_all_allies-user, user_cell, 2, false",
        "wait: 20",
        "effects: {aoe}_all_allies-user, current_obj",
        "wait: 60",
        "call: post-skill"
    ],

    "teleportation_sup": [
        "script: user.setDir(user._lastDir);",
        "call: pre-skill",
        "set_battler_targets: battler_toward_user",
        "anim: last_targets, 129",
        "wait: 40",
        "move_to_cell: last_targets, cursor_cell, true",
        "anim: last_targets, 130",
        "wait: 60",
        "call: post-skill"
    ],

    "explosive_mark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: explosive_mark, cursor_cell",
        "wait: 60",
        "call: post-skill"
    ],

    "ghost_arrow": [
        "call: pre-skill",
        "projectile: ghost_arrow, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60",
        "call: post-skill"
    ],

    "magic_trap": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: magic_trap, cursor_cell",
        "wait: 60",
        "call: post-skill"
    ],

    "fire_arrows": [
        "call: pre-skill",
        "call_for_every_entity: fire_arrow_dmg, {aoe}_battlers",
        "call: post-skill"
    ],

    "fire_arrow_dmg": [
        "projectile: fire_arrow, user_cell, saved(every_entity)",
        "effects: saved(every_entity), current_obj, obj_anim"
    ],

    "wind_spirit": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 15",
        "summon: wind_spirit, cursor_cell",
        "call: post-skill"
    ],

    "great_wind": [
        "call: pre-skill",
        "projectile: great_wind, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "set_speed: {aoe}_battlers, +12",
        "push: {aoe}_battlers, user_cell, 3",
        "set_speed: {aoe}_battlers, reset",
        "call: post-skill"
    ],

    "transposition": [
        "call: pre-skill",
        "anim: user, obj_anim",
        "anim: {aoe}_battlers, obj_anim",
        "wait: 40",
        "switch_cells: user, {aoe}_battlers",
        "call: post-skill"
    ],

    "summon_pixie": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 15",
        "summon: pixie, cursor_cell",
        "call: post-skill"
    ],

    "shamanism": [
        "call: pre-skill",
        "anim: {aoe}_dead_battlers, obj_anim",
        "wait: 20",
        "call_for_every_entity: shamanism_effects, {aoe}_dead_battlers",
        "call: post-skill"
    ],

    "shamanism_effects": [
        "anim: allies, 127",
        "effects: allies, current_obj",
        "wait: 60",
    ],

    //-

    "fire_ball": [
        "call: pre-skill",
        "projectile: fire_ball, user_cell, cursor_cell",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "wait: 60",
        "call: post-skill"
    ],

    "crystal_mark": [
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: crystal_mark, cursor_cell"
    ],

    "anti_crystal_mark": [
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: anti_crystal_mark, cursor_cell"
    ],

    "mago_mark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "mark: mago_mark, cursor_cell",
        "wait: 60",
        "call: post-skill"
    ],

    "rabbit_jump": [
        "set_frame: user, atk, 0",
        "wait: 8",
        "map_anim: user_cell, obj_anim",
        "jump_to_cell: user, cursor_cell",
        "play_pose: user, atk",
        "map_effects: user_cell, current_obj, obj_anim"
    ],

    "summon_pyra": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 15",
        "summon: pyra, cursor_cell",
        "call: post-skill"
    ],

    //-

    "rush_sup": [
        "wait: 20",
        "directional_anim: user, user, 131, 132, 133, 134",
        "look_at: user, cursor_cell",
        "move_straight: user, 2",
        "wait: 10",
        "effects: {aoe}_battlers, current_obj, obj_anim",
        "look_away: {aoe}_battlers, user_cell",
        "wait: 5",
        "delegate_call: rush_sup_action, {aoe}_battlers"
    ],

    "rush_sup_action": [
        "directional_anim: user, user, 131, 132, 133, 134",
        "move_straight: user, 2",
        "wait: 10",
        "set_battler_targets: battler_toward_user",
        "effects: last_targets, current_obj, obj_anim",
        "look_away: last_targets, user_cell",
        "wait: 5",
        "end_delegated_call:",
        "delegate_call: rush_sup_action, last_targets"
    ],
    

};

/*-------------------------------------------------------------------------
* AI
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.AI = {

    BehaviorsOrder: [
        "healing",
        "escape",
        "summon",
        "support",
        "offense" // <- Keep offense at the end, for now
    ],

    "default": [
        "process_behaviors",
        "call_behavior: end_of_turn"
    ],

    "end_of_turn": [
        "wait: 5",
        "pass: look_closest_enemy"
    ],


    /*-------------------------------------------------------------------------
    * Default behaviors
    -------------------------------------------------------------------------*/

    "use_healing": [
        "search_target: self, 100%, healing",
        "if: !isTargetValid()",
            "search_target: lowest_ally, 100%, healing",
            "if: !isTargetValid()",
                "search_target: closest_ally, 100%, healing",
            "endif",
        "endif",
        "if: isTargetValid()",
            "set_action: healing, average",
            "move_for_action: null",
            "use: defined_action",
        "end",
        "call_behavior: after_healing"
    ],

    "after_healing": [
        "if: user.hpRate() <= 0.3",
            "call_behavior: smart_move_away_enemies",
        "else",
            "call_behavior: after_offense",
        "endif"
    ],

    "use_support": [
        "search_target: lowest_ally, 100%, support",
        "if: !isTargetValid()",
            "search_target: self, 100%, support",
            "if: !isTargetValid()",
                "search_target: closest_ally, 100%, support",
            "endif",
        "endif",
        "if: isTargetValid()",
            "set_action: support, average",
            "move_for_action: null",
            "use: defined_action",
            "call_behavior: after_support",
        "else",
            "move: toward_enemies, 20%",
        "endif"
    ],

    "after_support": [
        "if: canUseEscape()",
            "call_behavior: escape",
        "else",
            "if: pattern('ranged_fighter')",
                "call_behavior: smart_move_away_enemies",
            "else",
                "move: toward_enemies, 100%",
            "endif",
        "endif"
    ],
    
    "use_summon": [
        "if: distanceToEnemies() > entity.getMovePoints() + 1",
            "move: toward_enemies, 75%",
        "endif",
        "set_action: summon",
        "move_for_action: null",
        "use: defined_action",
        "call_behavior: after_summon"
    ],

    "after_summon": [
        "call_behavior: after_support"
    ],

    "use_offense": [
        /*"if: chance(70)",
            "search_target: lowest_enemy, 100%, offense",
            "if: !isTargetValid()",
                "search_target: closest_enemy, 100%, offense",
            "endif",
        "else",
            "search_target: closest_enemy, 100%, offense",
        "endif",*/
        "search_target: closest_enemy, 100%, offense",
        "if: isTargetValid()",
            "set_action: damage, average",
            "move_for_action: null",
            "use: defined_action",
            "call_behavior: after_offense",
        "else",
            "script: console.log('TARGET NOT VALID')",
            "move: toward_enemies, 100%",
        "endif"
    ],

    "cant_use_offense": [
        "if: failureCode() === 'out_of_range'",
            "call_behavior: out_of_range",
        "else",
            "move: away_enemies, 100%",
        "endif"
    ],

    "after_offense": [
        "if: canUseEscape()",
            "call_behavior: escape",
        "else",
            "if: pattern('ranged_fighter')",
                "call_behavior: smart_move_away_enemies",
            "else",
                "if: !isInMeleeWith('defined_target')",
                    "move: toward_enemies, 100%",
                "endif",
            "endif",
        "endif"
    ],

    "out_of_range": [
        "if: canUseRush()",
            "set_action: move, toward",
            "move_for_action: null",
            "use: defined_action",
        "endif",
        "if: chance(40)",
            "move: toward_enemies, 80%",
        "else",
            "move: toward_enemies, 100%",
        "endif"
    ],

    "escape": [
        "set_action: move, away",
        "move_for_action: null",
        "use: defined_action",
        "wait: 10",
        "call_behavior: smart_move_away_enemies",
    ],

    "smart_move_away_enemies": [
        "if: distanceToEnemies() >= entity.getMovePoints() * 2",
            "move: toward_enemies, 75%",
        "else",
            "move: away_enemies, 100%",
        "endif",
    ]

    /*-------------------------------------------------------------------------
    * Your behaviors
    -------------------------------------------------------------------------*/
};