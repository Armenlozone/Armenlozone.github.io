import tankIcon from "../assets/icons/tank.svg";
import aircraftIcon from "../assets/icons/jet.svg";
import shipIcon from "../assets/icons/ship.svg";
import helicopterIcon from "../assets/icons/helicopter.svg";
import germanyIcon from "../assets/icons/flags/germany.svg";
import usaIcon from "../assets/icons/flags/usa.svg";
import ussrIcon from "../assets/icons/flags/ussr.svg";
import pakIcon from "../assets/icons/flags/pakistan.svg";

export const sidebarData = [
    {
        id: "ground",
        title: "Ground Forces",
        icon: tankIcon,
        children: [
            {
                id: "Pakistan",
                title: "Pakistan",
                icon: pakIcon,
                    link: "/techtrees/PkBd"
            },
            {
                id: "usa",
                title: "United States",
                icon: usaIcon,
                    link: "/techtrees/ground-usa"
            },
            {
                id: "ussr",
                title: "USSR",
                icon: ussrIcon,
                    link: "/techtrees/ground-ussr"
            }
        ]
    },

    {
        id: "air",
        title: "Aircraft",
        icon: aircraftIcon,
        children: [
            {
                id: "germany_air",
                title: "Germany",
                icon: germanyIcon,
                    link: "/techtrees/air-germany"
            },
            {
                id: "usa_air",
                title: "United States",
                icon: usaIcon,
                    link: "/techtrees/air-usa"
            }
        ]
    },

    {
        id: "heli",
        title: "Helicopters",
        icon: helicopterIcon,
        children: [
            {
                id: "germany_helis",
                title: "Germany",
                icon: germanyIcon,
                    link: "/techtrees/heli-germany"
            }
        ]
    },

    {
        id: "naval",
        title: "Naval",
        icon: shipIcon,
        children: [
            {
                id: "germany_naval",
                title: "Germany",
                icon: germanyIcon,
                    link: "/techtrees/naval-germany"
            }
        ]
    }
];