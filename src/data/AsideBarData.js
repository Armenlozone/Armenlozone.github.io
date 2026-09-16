import tankIcon from "../assets/icons/tank.svg";
import aircraftIcon from "../assets/icons/jet.svg";
import shipIcon from "../assets/icons/ship.svg";
import helicopterIcon from "../assets/icons/helicopter.svg";
import rocketIcon from "../assets/icons/rocket.svg";
import articleIcon from "../assets/icons/article.svg";
import lockIcon from "../assets/icons/padlock.svg";
import ww2germanyIcon from "../assets/icons/flags/ww2germany.svg";
import germanyIcon from "../assets/icons/flags/germany.svg";
import pakistanIcon from "../assets/icons/flags/pakistan.svg";
import franceIcon from "../assets/icons/flags/france.svg";
import usaIcon from "../assets/icons/flags/usa.svg";
import ussrIcon from "../assets/icons/flags/ussr.svg";
import swissIcon from "../assets/icons/flags/switzerland.svg";

export const sidebarData = [
    {
        id: "new",
        title: "New Articles",
        icon: articleIcon,
        children: [
            {
                id: "switzerland",
                title: "SkyGuard-M (NEW!)",
                icon: swissIcon,
                link: "/articles/skyguard-m"
            },
            {
                id: "germany",
                title: "HFK-KV (NEW!)",
                icon: germanyIcon,
                link: "/articles/hfk-kv"
            },
            {
                id: "germany",
                title: "Panther II (NEW!)",
                icon: ww2germanyIcon,
                link: "/articles/panther-ii"
            }
        ]
    },
    {
        id: "ground",
        title: "Ground Forces",
        icon: tankIcon,
        children: [
            {
                id: "switzerland",
                title: "SkyGuard-M",
                icon: swissIcon,
                link: "/articles/skyguard-m"
            },
            {
                id: "germany",
                title: "Panther II",
                icon: ww2germanyIcon,
                link: "/articles/panther-ii"
            },
            {
                id: "pakistan",
                title: "Viper IFV (coming soon)",
                icon: lockIcon,
                link: "/articles/viper-ifv"
            },
            {
                id: "pakistan",
                title: "T-84 BM Oplot-P (coming soon)",
                icon: lockIcon,
                link: "/articles/t-84-bm-oplot-p"
            },
            {
                id: "pakistan",
                title: "BATTAAR (coming soon)",
                icon: lockIcon,
                link: "/articles/battaar"
            },
            {
                id: "pakistan",
                title: "Al-Khalid INTERMAT (coming soon)",
                icon: lockIcon,
                link: "/articles/al-khalid-intermat"
            }
        ]
    },

    {
        id: "air",
        title: "Aircraft",
        icon: aircraftIcon,
        children: [
            {
                id: "pakistan",
                title: "Mirage IIIDP ROSE III (coming soon)",
                icon: lockIcon,
                link: "/articles/Mirage-III-ROSE-III"
            },
            {
                id: "pakistan",
                title: "Fury FB.60 (coming soon)",
                icon: lockIcon,
                link: "/articles/fury-fb-60"
            }
        ]
    },

    {
        id: "heli",
        title: "Helicopters",
        icon: helicopterIcon,
        children: [
            {
                id: "pakistan",
                title: "AH-1F Cobra (coming soon)",
                icon: lockIcon,
                link: "/articles/ah-1f-cobra"
            },
            {
                id: "france",
                title: "Eurocopter AS565 Panther OSIRIS (coming soon)",
                icon: lockIcon,
                link: "/articles/eurocopter-as565-panther-osiris"
            }
        ]
    },

    {
        id: "rockets",
        title: "Weaponry",
        icon: rocketIcon,
        children: [
            {
                id: "germany",
                title: "HFK-KV",
                icon: germanyIcon,
                link: "/articles/hfk-kv"
            }
        ]
    },

    {
        id: "naval",
        title: "Naval",
        icon: shipIcon,
        children: [
            {
                id: "pakistan",
                title: "PNS Babur-I C-84 (coming soon)",
                icon: lockIcon,
                link: "/articles/pns-babur-i-c-84"
            }
        ]
    }
];