import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { loadArticle } from "../../data/articleRegistry";
import { missingImage } from "../../data/articleAssets";

function handleImageError(event) {
    event.currentTarget.classList.add("image-load-error");
}

function extractYouTubeVideoId(value = "") {
    const trimmed = String(value).trim();

    if (!trimmed) {
        return "";
    }

    const match = trimmed.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i
    );

    return match ? match[1] : trimmed;
}

function GalleryCarousel({ images }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const items = images?.filter(Boolean) ?? [];

    if (!items.length) {
        return null;
    }

    const goToPrevious = () => {
        setCurrentIndex((previous) => (
            previous === 0
                ? items.length - 1
                : previous - 1
        ));
    };

    const goToNext = () => {
        setCurrentIndex((previous) => (
            previous === items.length - 1
                ? 0
                : previous + 1
        ));
    };

    return (
        <div className="article-gallery">
            <div className="article-gallery-viewport">
                <div
                    className="article-gallery-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {items.map((image, index) => (
                        <figure
                            key={`${image.src || "gallery"}-${index}`}
                            className="article-gallery-slide"
                        >
                            <img
                                src={image.src || missingImage}
                                alt={
                                    image.caption ||
                                    `Gallery image ${index + 1}`
                                }
                                onError={handleImageError}
                            />

                            {image.caption && (
                                <figcaption>
                                    {image.caption}
                                </figcaption>
                            )}
                        </figure>
                    ))}
                </div>
            </div>

            {items.length > 1 && (
                <div className="article-gallery-controls">
                    <button
                        type="button"
                        className="article-gallery-button"
                        onClick={goToPrevious}
                        aria-label="Previous image"
                    >
                        ◀
                    </button>

                    <span className="article-gallery-counter">
                        {currentIndex + 1} / {items.length}
                    </span>

                    <button
                        type="button"
                        className="article-gallery-button"
                        onClick={goToNext}
                        aria-label="Next image"
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
}

function VideoCarousel({ videos }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const items = (videos ?? [])
        .map((video) => ({
            ...video,
            videoId: extractYouTubeVideoId(video.id || "")
        }))
        .filter((video) => video.videoId);

    if (!items.length) {
        return null;
    }

    const goToPrevious = () => {
        setCurrentIndex((previous) => (
            previous === 0
                ? items.length - 1
                : previous - 1
        ));
    };

    const goToNext = () => {
        setCurrentIndex((previous) => (
            previous === items.length - 1
                ? 0
                : previous + 1
        ));
    };

    return (
        <div className="article-video-carousel">
            <div className="article-video-carousel-viewport">
                <div
                    className="article-video-carousel-track"
                    style={{
                        transform: `translateX(-${currentIndex * 100}%)`
                    }}
                >
                    {items.map((video, index) => (
                        <div
                            key={`${video.videoId}-${index}`}
                            className="article-video-carousel-slide"
                        >
                            <div className="article-video">
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${video.videoId}`}
                                    title={video.title || "YouTube video"}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>

                            {video.title && (
                                <p className="article-video-carousel-caption">
                                    {video.title}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {items.length > 1 && (
                <div className="article-video-carousel-controls">
                    <button
                        type="button"
                        className="article-video-carousel-button"
                        onClick={goToPrevious}
                        aria-label="Previous video"
                    >
                        ◀
                    </button>

                    <span className="article-video-carousel-counter">
                        {currentIndex + 1} / {items.length}
                    </span>

                    <button
                        type="button"
                        className="article-video-carousel-button"
                        onClick={goToNext}
                        aria-label="Next video"
                    >
                        ▶
                    </button>
                </div>
            )}
        </div>
    );
}

function renderBlock(section, key) {

    // -------------------------
    // IMAGE
    // -------------------------

    if (section.type === "image") {
        return (
            <figure key={key}>
                <img
                    src={section.src || missingImage}
                    alt={section.caption || "Article illustration"}
                    onError={handleImageError}
                />

                {section.caption && (
                    <figcaption>
                        {section.caption}
                    </figcaption>
                )}
            </figure>
        );
    }


    // -------------------------
    // LIST
    // -------------------------

    if (section.type === "list") {
        return (
            <ul
                key={key}
                style={{ paddingLeft: "2rem" }}
            >
                {section.items.map((item, index) => (
                    <li key={index}>
                        {item}
                    </li>
                ))}
            </ul>
        );
    }


    // -------------------------
    // URL
    // -------------------------

    if (section.type === "url") {
        return (
            <p key={key}>
                <a
                    href={section.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {section.text}
                </a>
            </p>
        );
    }


    // -------------------------
    // URL LIST
    // -------------------------

    if (section.type === "url-list") {
        return (
            <ul
                key={key}
                style={{
                    paddingLeft: "2rem",
                    color: "white"
                }}
            >
                {section.urls.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            marginBottom: "0.5rem"
                        }}
                    >
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        );
    }


    // -------------------------
    // QUOTE
    // -------------------------

    if (section.type === "quote") {
        return (
            <blockquote key={key}>
                <p>
                    {section.content}
                </p>

                {section.author && (
                    <footer>
                        — {section.author}
                    </footer>
                )}
            </blockquote>
        );
    }


    // -------------------------
    // TABLE
    // -------------------------

    if (section.type === "table") {
        return (
            <div
                key={key}
                className="article-table-container"
            >
                <table className="article-table">

                    {section.headers && (
                        <thead>
                            <tr>
                                {section.headers.map((header, index) => (
                                    <th key={index}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                    )}

                    <tbody>
                        {section.rows?.map((row, rowIndex) => (
                            <tr key={rowIndex}>

                                {row.map((cell, cellIndex) => (
                                    <td key={cellIndex}>
                                        {cell}
                                    </td>
                                ))}

                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        );
    }


    // -------------------------
    // SPECIFICATIONS
    // -------------------------

    if (section.type === "specifications") {
        return (
            <div
                key={key}
                className="article-specifications"
            >
                {section.items.map((item, index) => (
                    <div
                        className="specification-row"
                        key={index}
                    >

                        <span className="specification-label">
                            {item.item}
                        </span>

                        <span className="specification-value">
                            {item.value}
                        </span>

                    </div>
                ))}
            </div>
        );
    }


    // -------------------------
    // GALLERY
    // -------------------------

    if (section.type === "gallery") {
        return (
            <GalleryCarousel
                key={key}
                images={section.images}
            />
        );
    }


    // -------------------------
    // YOUTUBE VIDEO
    // -------------------------

    if (section.type === "video" || section.type === "youtube") {
        // Support both the newer multi-video carousel shape (section.videos)
        // and older single-video sections (section.id / section.title).
        const videos = section.videos ?? [
            {
                id: section.id,
                title: section.title
            }
        ];

        return (
            <VideoCarousel
                key={key}
                videos={videos}
            />
        );
    }


    // -------------------------
    // DEFAULT: PARAGRAPH
    // -------------------------

    return (
        <p key={key}>
            {section.content}
        </p>
    );
}


export default function ArticleRenderer() {

    const { articleSlug } = useParams();
    const [article, setArticle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [openSections, setOpenSections] = useState({});

    useEffect(() => {
        let isActive = true;

        const fetchArticle = async () => {
            setIsLoading(true);
            const loadedArticle = await loadArticle(articleSlug);

            if (isActive) {
                setArticle(loadedArticle);
                setIsLoading(false);
            }
        };

        fetchArticle();

        return () => {
            isActive = false;
        };
    }, [articleSlug]);

    if (isLoading) {
        return null;
    }

    if (!article) {
        return (
            <p>
                The requested article is currently not available.
            </p>
        );
    }


    // -------------------------
    // GROUP ARTICLE SECTIONS
    // -------------------------

    const sectionGroups = [];

    let currentGroup = null;


    article.sections?.forEach((section, index) => {

        if (section.type === "heading") {

            if (currentGroup) {
                sectionGroups.push(currentGroup);
            }

            currentGroup = {
                id: `section-${index}`,
                title: section.content,
                blocks: []
            };

            return;
        }


        if (!currentGroup) {

            currentGroup = {
                id: `section-${index}`,
                title: "Introduction",
                blocks: []
            };

        }


        currentGroup.blocks.push(section);

    });


    if (currentGroup) {
        sectionGroups.push(currentGroup);
    }


    // -------------------------
    // TOGGLE SECTION
    // -------------------------

    const toggleSection = (sectionId) => {

        setOpenSections((prev) => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));

    };


    // -------------------------
    // RENDER
    // -------------------------

    return (

        <article className="article-page">


            {/* HERO */}

            <header className="article-hero">

                <img
                    src={article.hero || missingImage}
                    alt={article.title}
                    className="article-hero-image"
                    onError={handleImageError}
                />

                <div>

                    <center>
                        <h1>
                            {article.title}
                        </h1>
                    </center>

                    <center>
                        <p>
                            {article.subtitle}
                        </p>
                    </center>

                    <center>
                        <small>
                            {article.nation} · {article.branch}
                        </small>
                    </center>

                </div>

            </header>


            {/* ARTICLE SECTIONS */}

            <section className="article-sections">

                {sectionGroups.map((group, index) => {

                    const isOpen =
                        openSections[group.id] ??
                        index === 0;


                    return (

                        <div
                            key={group.id}
                            className="article-collapsible"
                        >

                            <button
                                type="button"
                                className="collapsible-trigger"
                                onClick={() =>
                                    toggleSection(group.id)
                                }
                            >

                                <span>
                                    {group.title}
                                </span>

                                <span>
                                    {isOpen ? "▾" : "▸"}
                                </span>

                            </button>


                            {isOpen && (

                                <div className="collapsible-content">

                                    {group.blocks.map(
                                        (block, blockIndex) =>
                                            renderBlock(
                                                block,
                                                `${group.id}-${blockIndex}`
                                            )
                                    )}

                                </div>

                            )}

                        </div>

                    );

                })}

            </section>

        </article>

    );
}