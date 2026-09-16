import { getArticleImage } from "../../../../data/articleAssets";

export default {
    id: "hfk-kv",
    title: "BGT HFK-KV",
    subtitle: "The Roland HFK Upgrade",
    nation: "Germany",
    branch: "Weaponry",
    hero: getArticleImage("bgt hfk-kv", "hfkMissile.jpeg"),
    sections: [
        {
            type: "paragraph",
            content: "In 1989, BGT introduced an alternative to the Thales VT-1 missile upgrade for the Roland air defense system, named the HFK-KV (Hyperschallflugkörper-Kill Vehicle). This hypervelocity missile, derived from the HFK-L2 demonstrator missile, featured a kinetic kill vehicle equipped with an infrared seeker, inertial reference unit, aerodynamic control system, and directed-effect warhead. It was capable of reaching a maximum speed of Mach 5 and reached Mach 7+ during testing."
        },
        {
            type: "paragraph",
            content: " Recent testing, as of December 2001, involved eight launches and firings. The HFK/KV could potentially have elevated the capabilities of the Roland weapon system, bringing it more in line with systems like the Pantsir S1 and the future Pantsir S2 or SM."
        },
        {
            type: "heading",
            content: "Preceeding variants"
        },
        {
            type: "paragraph",
            content: "The HFK/KV missile design aimed for interchangeability with existing Roland canisters and launch systems, with a projected maximum powered range of 12 km. The two-stage missile comprised a solid-propellant boost motor and a kinetic kill vehicle, demonstrating exceptional speed and precision during testing. A second version, the HFK/L, was a single-stage missile that reached Mach 5.3 (1.8 km/s) and underwent guided flight trials up to February 2002. Plans for a larger boost motor accelerating the missile to Mach 7.0 (2.3 km/s) were in development as of October 2000."
        },
        {
            type: "image",
            src: getArticleImage("bgt hfk-kv", "hfkl1LAUNCH.jpg"),
            caption: "HFK/L1 Launch"
        },
        {
            type: "heading",
            content: "Technical Specifications"
        },
        {
            type: "specifications",
            items: [
                {
                    item: "Missile Calibre: ",
                    value: "165 mm"
                },
                {
                    item: "Launch weight: ",
                    value: "approximately 140 kg"
                },
                {
                    item: "First-stage boost weight: ",
                    value: "44 kg"
                },
                {
                    item: "First-stage missile length: ",
                    value: "2.8 m"
                },
                {
                    item: "Boost-stage acceleration: ",
                    value: "0 to Mach 5 in 1 second"
                },
                {
                    item: "Boost thrust: ",
                    value: "100 kN"
                },
                {
                    item: "Maximum speed: ",
                    value: "Mach 7+"
                },
                {
                    item: "Second-stage terminal-phase weight: ",
                    value: "16 kg"
                },
                {
                    item: "Second-stage kill-vehicle length: ",
                    value: "0.9 m"
                },
                {
                    item: "Maximum overload: ",
                    value: "100G"
                },
                {
                    item: "Warhead explosive mass: ",
                    value: "5 kg"
                },
                {
                    item: "Maximum terminal range: ",
                    value: "40-50 km, ballistic/aerodynamic cap ejected 2 seconds before interception"
                },
                {
                    item: "Seeker specifications: ",
                    value: "32 scanning detector elements"
                }
            ]
        },
        {
            type: "heading",
            content: "Comment by Head of BGT Liaison Office"
        },
        {
            type: "quote",
            content: "The company was developing the HFK hypervelocity missile to replace the Roland surface-to-air missile system. The missile was designed to fit into existing Roland launchers. He notes that the \"Mach 6\" missile was originally conceived to combat main battle tanks at medium distances by penetrating armor through kinetic-energy impact.",
            author: "Dr. Michael Langer, head of the BGT liaison office in Koblenz"
        },
        {
            type: "paragraph",
            content: "Due to the specific mention of anti-armor usage, it can be presumed with a high degree of accuracy that the HFK has the capability to penetrate a significant length of rolled homogeneous armor, especially at the speeds it can achieve."
        },
        {
            type: "heading",
            content: "Visual References"
        },
        {
            type: "gallery",
            images: [
                {
                    src: getArticleImage("bgt hfk-kv", "hfk_kv_display.jpeg"),
                    caption: "Front view of the HFK missile, showcasing the seeker for terminal guidance"
                },
                {
                    src: getArticleImage("bgt hfk-kv", "hfk_kv_page.jpeg")
                },
                {
                    src: getArticleImage("bgt hfk-kv", "hfk_kv_source.jpeg"),
                    caption: "Janes Strategic Weapons Systems January 2003"
                }
            ]
        },
        {
            type: "heading",
            content: "Sources"
        },
        {
            type: "url-list",
            urls: [
                {
                    url: "https://web.archive.org/web/20040912041501/http://www.afcea.org/signal/europe2000/germany/Germany.htm",
                    text: "Signal Europe 2000 - Germany"
                },
                {
                    url: "https://web.archive.org/web/20171013172306/https://www.forecastinternational.com/archive/disp_old_pdf.cfm?ARC_ID=1097",
                    text: "Forecast International"
                },
                {
                    url: "https://web.archive.org/web/20071011055437/http://mbda-systems.com/mbda/site/FO/scripts/siteFO_contenu.php",
                    text: "MBDA Systems"
                },
                {
                    url: "https://www.secretprojects.co.uk/threads/german-short-range-sams.1735/",
                    text: "Secret Projects Forum"
                },
                {
                    url: "https://cloud.mail.ru/public/9dEX/djuwzbp4V/Wehrtechnik/1995%20not%20renamed/05",
                    text: "Wehrtechnik 1995, Issue 5"
                },
                {
                    url: "https://cloud.mail.ru/public/9dEX/djuwzbp4V/Wehrtechnik/2002%20not%20renamed/03",
                    text: "Wehrtechnik 2002, Issue 3"
                },
                {
                    url: "https://archive.org/stream/DTIC_ADA359244/DTIC_ADA359244_djvu.txt",
                    text: "DTIC Report"
                }
            ]
        }
    ]
};