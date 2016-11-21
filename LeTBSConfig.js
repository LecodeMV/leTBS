Lecode.S_TBS.Config = {};


/*-------------------------------------------------------------------------
* Sprites Poses
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.Battler_Sprites = {

    // Config_name: data
    "Default": [
        // [pose_name,filename,frames,hue]
        ["idle", "_idle", 3, 0],
        ["dead", "_dead", 1, 0]
    ],

    "Angela": [
        ["idle", "_idle", 1, 0],
        ["move", "_move", 4, 0],
        ["cast", "_cast", 1, 0],
        ["atk", "_atk", 4, 0],
        ["hit", "_hit", 1, 0],
        ["dead", "_dead", 1, 0],
        ["turn_start", "_victory", 5, 0],
        ["victory", "_victory", 5, 0]
    ],

    "Duran": [
        ["idle", "_idle", 1, 0],
        ["move", "_move", 4, 0],
        ["cast", "_cast", 3, 0],
        ["atk", "_atk", 4, 0],
        ["hit", "_hit", 1, 0],
        ["dead", "_dead", 1, 0]
    ],

    "Rabbit": [
        ["idle", "_idle", 1, 0],
        ["move", "_move", 3, 0],
        ["atk", "_atk", 3, 0],
        ["hit", "_hit", 1, 0],
        ["dead", "_dead", 1, 0]
    ],

    "Mago": [
        ["idle", "_idle", 1, 0],
        ["move", "_move", 3, 0],
        ["cast", "_cast", 2, 0],
        ["atk", "_atk", 4, 0],
        ["hit", "_hit", 1, 0],
        ["dead", "_dead", 1, 0]
    ],

    "Evil Statue": [
        ["idle", "_idle", 1, 0],
        ["cast", "_cast", 4, 0],
        ["atk", "_cast", 4, 0],
        ["dead", "_dead", 1, 0]
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
            "stepping": {
                stop_movement: false,
                skill_effects: 24,
                effects_aoe: "circle(0)"
            },
            "turn_start": {
                stop_movement: false,
                skill_effects: 24,
                effects_aoe: "circle(0)"
            },
            "turn_end": {
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
        anim: [147, 36, 16],
        adapt_angle: true,
        speed: 9,
        jump: 0
    }

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
        "perform_collapse: user",
        "play_pose: user, dead, dead",
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
        "effects: aoe_all_battlers, current_obj, obj_anim",
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
        "effects: aoe_all_battlers, current_obj, obj_anim, 0, true",
        "call: post-skill"
    ],

    "item": [
        "play_pose: user, item",
        "wait: 10",
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    "bow": [
        "play_pose: user, atk",
        "wait: 10",
        "projectile: bow_arrow, user_cell, cursor_cell",
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "wait: 60"
    ],

    /*-------------------------------------------------------------------------
    * Your Sequences
    -------------------------------------------------------------------------*/

    "repulsive_blow": [
        "play_pose: user, atk",
        "wait: 10",
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "set_speed: aoe_all_battlers, +6",
        "push: aoe_all_battlers, user_cell, 3",
        "set_speed: aoe_all_battlers, reset",
        "wait: 60"
    ],

    "bolt_jump": [
        "set_frame: user, atk, 0",
        "wait: 15",
        "jump_to_cell: user, cursor_cell",
        "play_pose: user, atk",
        "map_effects: aoe-user_cell, current_obj, obj_anim"
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
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "wait: 20",
        "play_pose: user, idle",
        "wait: 10"
    ],

    //-

    "spark": [
        "call: pre-skill",
        "map_anim: cursor_cell, obj_anim",
        "wait: 20",
        "effects: aoe_all_battlers, current_obj",
        "call: post-skill"
    ],

    "lightning_storm": [
        "call: pre-skill",
        "call: lightning_storm_effects, 3",
        "call: post-skill"
    ],

    "lightning_storm_effects": [
        "effects: 1_random_battlers_in_aoe, current_obj, obj_anim",
        "wait: 60"
    ],

    "fire_storm": [
        "call: pre-skill",
        "call: fire_storm_effects, 6",
        "call: post-skill"
    ],

    "fire_storm_effects": [
        "map_effects: 1_random_cells_in_aoe, current_obj, obj_anim",
        "wait: 60"
    ],

    "fire_support": [
        "ask_call: fire_support_attack, allies_at_distance_1_from_cursor_cell",
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
        "map_anim: aoe, obj_anim",
        "wait: 20",
        "mark: volcano_cell, aoe",
        "wait: 60",
        "call: post-skill"
    ],


    //-

    "heal": [
        "call: pre-skill",
        "anim: aoe_all_battlers, obj_anim",
        "wait: 20",
        "effects: aoe_all_battlers, current_obj",
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
        "pull: aoe_all_allies-user, user_cell, 2, false",
        "wait: 20",
        "effects: aoe_all_allies-user, current_obj",
        "wait: 60",
        "call: post-skill"
    ],

    "teleportation_sup": [
        "script: user.setDir(user._lastDir);",
        "call: pre-skill",
        "set_battler_targets: battler_toward_user",
        "anim: last_battler_targets, 129",
        "wait: 40",
        "move_to_cell: last_battler_targets, cursor_cell, true",
        "anim: last_battler_targets, 130",
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
        "effects: aoe_all_battlers, current_obj, obj_anim",
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

    //-

    "fire_ball": [
        "call: pre-skill",
        "projectile: fire_ball, user_cell, cursor_cell",
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "wait: 60",
        "call: post-skill"
    ],

    //-

    "rush_sup": [
        "wait: 20",
        "directional_anim: user, user, 131, 132, 133, 134",
        "look_at: user, cursor_cell",
        "move_straight: user, 2",
        "wait: 10",
        "effects: aoe_all_battlers, current_obj, obj_anim",
        "look_away: aoe_all_battlers, user_cell",
        "wait: 5",
        "delegate_call: rush_sup_action, aoe_all_battlers"
    ],

    "rush_sup_action": [
        "directional_anim: user, user, 131, 132, 133, 134",
        "move_straight: user, 2",
        "wait: 10",
        "set_battler_targets: battler_toward_user",
        "effects: last_battler_targets, current_obj, obj_anim",
        "look_away: last_battler_targets, user_cell",
        "wait: 5",
        "end_delegated_call:",
        "delegate_call: rush_sup_action, last_battler_targets"
    ]

};

/*-------------------------------------------------------------------------
* AI
-------------------------------------------------------------------------*/
Lecode.S_TBS.Config.AI = {

    /*"default": [
    	"if: user.isDying()",
    		"use: heal, best, self, ignore, true",
    		"if: user.isDying()",
    			"use: flee, best, self, ignore, true",
    			"move: away_enemies",
    			"pass: look_closest_enemy",
    		"else",
    			"use: dmg, average, closest_enemy, keep_50%, false",
    			"move: away_enemies",
    			"pass: look_closest_enemy",
    		"end",
    	"else if: canUseHealObjs() && injuredAllyInRange(30%)",
    		"use: heal, average, lowest_ally, ignore, true",
    		"move: away_enemies, 60%",
    		"pass: look_closest_enemy",
    	"else if: canUseSupportObjs() && chance(30)",
    		"use: support, best, random_ally, ignore, true",
    		"move: away_enemies, 60%",
    		"pass: look_closest_enemy",
    	"else if: canUseDamageObjs()",
    		"use: dmg, average, lowest_enemy, ignore, true",
    		"move: away_enemies, 10%",
    		"pass: look_closest_enemy",
    	"endif"
    ]*/

    "default": [
        "wait: 60",
        "pass: look_closest_enemy",
        "wait: 30",
        "if: canUseOffense()",
        	"script: console.log('Ok')",
        "endif",
    ],

    "attack": [
        "wait: 5",
        "if: canUseOffense()",
        	"call_behavior: use_offense",
        "else",
        	"call_behavior: cant_use_offense",
        "endif",
        "wait: 5",
        "pass: look_closest_enemy"
    ],

    "use_offense": [
        "if: chance(70)",
        	"search_target: lowest_enemy, 100%",
        	"if: !isTargetValid()",
        		"search_target: closest_enemy, 100%",
        	"endif",
        "else",
        	"search_target: closest_enemy, 100%",
        "endif",
        "if: isTargetValid()",
        	"set_action: damage, average",
        	"if: !battlerInRange('defined_target','defined_action')",
        		"move_for_action: null",
        	"endif",
        	"use: defined_action",
        	"call_behavior: after_offense",
        "else",
        	"move: toward_enemies, 100%",
        "endif"
    ],

    "cant_use_offense": [
        //"script: console.log('cant use offense')",
        "if: failureCode() === 'out_of_range'",
        	"if: chance(40)",
        		"move: toward_enemies, 80%",
        	"else",
        		"move: toward_enemies, 100%",
        	"endif",
        "else",
        	"move: away_enemies, 100%",
        "endif"
    ],

    "after_offense": [
        "if: pattern('ranged_fighter')",
        	"move: away_enemies, 100%",
        "else",
        	"if: !isInMeleeWith('defined_target')",
        		"move: away_enemies, 50%",
        	"endif",
        "endif"
    ]
};