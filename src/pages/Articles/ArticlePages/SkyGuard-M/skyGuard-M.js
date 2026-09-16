import { getArticleImage } from "../../../../data/articleAssets";

export default {
    id: "skyguard-m",

    title: "SkyGuard-M",

    subtitle: "The Swiss-German six-shooter",

    nation: "Switzerland",

    branch: "Ground Forces",

    hero: getArticleImage("SkyGuard-M", "sgm.jpeg"),

    sections: [
        {
            type: "paragraph",
            content:
                "The SkyGuard System is a stationary air-defense radar system for detecting airborne vehicles," + 
                " munitions, and for critical asset protection. Originally developed as a target detection and" + 
                " fire-control system for use with separate Oerlikon GDF gun systems and VSHORAD SAM systems," + 
                " this specific version was adapted for mounting on a Volvo SM 868 chassis."
        },
        {
            type: "heading",
            content: "Standalone SkyGuard Radar System"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg.jpeg"),
            caption: "Standalone SkyGuard radar system"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_specs.png"),
            caption: "SkyGuard system specifications"
        },
        {
            type: "heading",
            content: "Skyguard-M sections"
        },
        {
            type: "paragraph",
            content:
                "Highlighted in yellow: Volvo SM 868. Highlighted in blue: SkyGuard system. Highlighted in grey: integrated missile launchers."
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_sections.jpeg"),
            caption: "SkyGuard-M sections overview"
        },
        {
            type: "heading",
            content: "Details"
        },
        {
            type: "paragraph",
            content:
                "The Rheinmetall Oerlikon SkyGuard system is a modern radar system capable of engaging a wide variety of air threats, including low-flying aircraft and air-to-ground guided weapons. The SkyGuard-M was equipped with pulse-Doppler search and tracking radars from Oerlikon Contraves and an infrared goniometer for measuring the entry phase of guided missiles. It also possessed an electro-optical target tracking system."
        },
        {
            type: "paragraph",
            content:
                "The search radar operates on S or X band, while the track radar operates on Ku or X band. The system was combined with a guided missile launcher to form a fully integrated fire unit, and it was operated by a crew of three: a driver and two operators."
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_inside.jpeg"),
            caption: "Operators cabin of the SkyGuard-M"
        },
        {
            type: "paragraph",
            content:
                "The digital computer interface is the nerve center of the SkyGuard-M and carries out all calculation tasks required. The SkyGuard-M system and crew cabin, which carries six weapons mounted on the sides, can be rotated freely in relation to the driver’s cabin and vehicle chassis. The system is designed so that a large number of anti-aircraft guided weapons can be integrated, allowing multiple targets to be engaged simultaneously."
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_folding.png"),
            caption: "SkyGuard-M radar being folded for transport"
        },
        {
            type: "heading",
            content: "Missile options"
        },
        {
            type: "paragraph",
            content:
                "Compatible missile families include:"
        },
        {
            type: "list",
            items: [
                "Roland 1",
                "Roland 2",
                "Roland 3",
                "Roland M5",
                "VT-1",
                "HFK/KV",
                "Crotale",
                "Rapier",
                "AIM-9C",
                "AIM-7",
                "MIM-72",
                "Seacat",
                "Tigercat",
                "Sistel Indigo"
            ]
        },
        {
            type: "heading",
            content: "Autocannon"
        },
        {
            type: "paragraph",
            content:
                "One of the six missile launchers can be replaced by a high-performance machine cannon of any type, including a single-tube or gatling cannon. In the pictured example, a six-barrelled 20 mm Vulcan cannon is fitted with an ammunition container mounted beneath it."
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_cannon.jpeg"),
            caption: "SkyGuard-M fitted with a 20 mm Vulcan cannon"
        },
        {
            type: "heading",
            content: "Standard SM868"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sm868.jpeg"),
            caption: "Volvo SM 868 chassis"
        },
        {
            type: "heading",
            content: "SM 868 specifications"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sm868_specs.jpeg"),
            caption: "SM 868 specifications"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sm868_specsTranslated.jfif"),
            caption: "Translated SM 868 specifications"
        },
        {
            type: "heading",
            content: "Other applied mountings of the Skyguard radar system"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sgM_m548.jpeg"),
            caption: "Tracked M548 mounting with missile launchers"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sg_m548.jpeg"),
            caption: "SkyGuard radar on an M548 vehicle"
        },
        {
            type: "paragraph",
            content:
                "The production Skyguard can and has been installed on a tracked M548 vehicle, to which up to three guided missile launchers can be connected."
        },
        {
            type: "heading",
            content: "Textual sources"
        },
        {
            type: "image",
            src: getArticleImage("SkyGuard-M", "sgm_wehrteknik.jpeg"),
            caption: "Wehrtechnik magazine article on the SkyGuard-M; October, 1973"
        },
        {
            type: "heading",
            content: "Web sources"
        },
        {
            type: "url-list",
            urls: [
                {
                    url: "https://www.rheinmetall.com/en/products/air-defence-systems/stationary-air-defence#anchor-skyguard-3-air-defence-system",
                    text: "Rheinmetall SkyGuard product page"
                },
                {
                    url: "https://web.archive.org/web/20231119095647/https://www.rheinmetall.com/Rheinmetall%20Group/brochure-download/Air-Defence/D1019e0222-Oerlikon-Skyguard-5-FCU.pdf",
                    text: "Rheinmetall SkyGuard brochure"
                },
                {
                    url: "https://www.missilery.info/missile/skyguard",
                    text: "missilery.info SkyGuard entry"
                },
                {
                    url: "https://web.archive.org/web/20240718060845/https://www.solhem9.se/broschyrbank_skogsbruk/BM_Volvo_SM_868.pdf",
                    text: "Volvo SM 868 brochure"
                }

            ]
        }
    ]
};