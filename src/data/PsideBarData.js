import tankIcon from "../assets/icons/tank.svg";
import aircraftIcon from "../assets/icons/jet.svg";
import shipIcon from "../assets/icons/ship.svg";
import helicopterIcon from "../assets/icons/helicopter.svg";
import germanyIcon from "../assets/icons/flags/germany.svg";
import usaIcon from "../assets/icons/flags/usa.svg";
import ussrIcon from "../assets/icons/flags/ussr.svg";
import swissIcon from "../assets/icons/flags/switzerland.svg";

export const sidebarData = [
    {
        id: "ground",
        title: "Ground Forces",
        icon: tankIcon,
        children: [
            // {
            //     id: "switzerland",
            //     title: "SkyGuard-M",
            //     icon: swissIcon,
            //     link: "/articles/skyguard-m"
            // }
        ]
    },

    {
        id: "air",
        title: "Aircraft",
        icon: aircraftIcon,
        children: [
        ]
    },

    {
        id: "heli",
        title: "Helicopters",
        icon: helicopterIcon,
        children: [
        ]
    },

    {
        id: "naval",
        title: "Naval",
        icon: shipIcon,
        children: [
        ]
    }
];