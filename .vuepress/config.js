module.exports = {
    title: "LeTBS Documentation 0.8",
    description: "Documentation and guides for LeTBS",
    base: "/leTBS/",
    themeConfig: {
        displayAllHeaders: true,
        nav: [
            { text: "Home", link: "/" },
            {
                text: "References",
                items: [
                    { text: "API", link: "/" },
                    { text: "Executor Commands", link: "/" },
                    { text: "Executor Targets", link: "/" },
                    { text: "Scope Building", link: "/" },
                    { text: "AoE Creator", link: "/" },
                    { text: "Notetags", link: "/" },
                    { text: "Signals", link: "/" }
                ]
            },
            { text: "Patreon", link: "https://google.com" }
        ],

        sidebar: [
            ["/", "Introduction"],
            {
                title: "User Guide",
                collapsable: true,
                children: [
                    "/user-guide/",
                    "/user-guide/plugin-params.md",
                    "/user-guide/resources.md",
                    "/user-guide/entities.md",
                    "/user-guide/map.md",
                    "/user-guide/actions.md",
                    "/user-guide/scopes.md",
                    "/user-guide/battle.md",
                    "/user-guide/sequences.md",
                    "/user-guide/damage.md",
                    "/user-guide/eventing.md",
                    "/user-guide/ai.md",
                    "/user-guide/scripts.md",
                    "/user-guide/signals.md"
                ]
            },
            {
                title: "Developer Guide",
                collapsable: true,
                children: [
                    "/dev-guide/",
                    "/dev-guide/contributing.md",
                    "/dev-guide/config.md",
                    "/dev-guide/components.md",
                    "/dev-guide/extensions.md",
                    "/dev-guide/phases.md",
                    "/dev-guide/addons.md"
                ]
            }
        ]
    }
};
