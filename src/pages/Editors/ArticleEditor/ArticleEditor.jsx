import { useRef, useState } from "react";
import {
    getArticleImage,
    missingImage
} from "../../../data/articleAssets";
import "./ArticleEditor.css";

const createId = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const extractYouTubeVideoId = (value = "") => {
    const trimmed = String(value).trim();

    if (!trimmed) {
        return "";
    }

    const match = trimmed.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i
    );

    return match ? match[1] : trimmed;
};

const createItem = (type) => {
    const base = {
        id: createId(),
        type
    };

    switch (type) {
        case "heading":
            return {
                ...base,
                content: ""
            };

        case "paragraph":
            return {
                ...base,
                content: ""
            };

        case "list":
            return {
                ...base,
                items: [""]
            };

        case "image":
            return {
                ...base,
                src: "",
                imageFileName: "",
                caption: ""
            };

        case "video":
        case "youtube":
            return {
                ...base,
                videos: [
                    {
                        id: "",
                        title: ""
                    }
                ]
            };

        case "url":
            return {
                ...base,
                url: "",
                text: ""
            };

        case "url-list":
            return {
                ...base,
                urls: [
                    {
                        url: "",
                        text: ""
                    }
                ]
            };

        case "specifications":
            return {
                ...base,
                items: [
                    {
                        item: "",
                        value: ""
                    }
                ]
            };

        case "quote":
            return {
                ...base,
                content: "",
                author: ""
            };

        case "gallery":
            return {
                ...base,
                images: [
                    {
                        src: "",
                        imageFileName: "",
                        caption: ""
                    }
                ]
            };

        default:
            return {
                ...base,
                content: ""
            };
    }
};

const createEmptyArticle = () => ({
    id: "new-article",
    title: "New Article",
    subtitle: "",
    nation: "",
    branch: "",
    hero: "",
    heroFileName: "",
    sections: []
});

export default function ArticleEditor() {
    const fileInputRef = useRef(null);
    const heroImageInputRef = useRef(null);

    const [galleryIndexes, setGalleryIndexes] = useState({});
    const [videoIndexes, setVideoIndexes] = useState({});

    const [article, setArticle] = useState(
        createEmptyArticle()
    );

    /*
    ============================================================
    ARTICLE METADATA
    ============================================================
    */

    function updateArticle(field, value) {
        setArticle((previous) => ({
            ...previous,
            [field]: value
        }));
    }

    /*
    ============================================================
    IMAGE HANDLING
    ============================================================
    */

    function handleImageUpload(file, callback) {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            callback({
                preview: reader.result,
                filename: file.name
            });
        };

        reader.readAsDataURL(file);
    }

    function handleHeroUpload(event) {
        const file = event.target.files?.[0];

        handleImageUpload(file, ({ preview, filename }) => {
            setArticle((previous) => ({
                ...previous,
                hero: preview,
                heroFileName: filename
            }));
        });

        event.target.value = "";
    }

    function handleSingleImageUpload(itemId, event) {
        const file = event.target.files?.[0];

        handleImageUpload(file, ({ preview, filename }) => {
            updateItem(itemId, {
                src: preview,
                imageFileName: filename
            });
        });

        event.target.value = "";
    }

    function handleGalleryImageUpload(
        itemId,
        imageIndex,
        event
    ) {
        const file = event.target.files?.[0];

        handleImageUpload(file, ({ preview, filename }) => {
            setArticle((previous) => ({
                ...previous,
                sections: previous.sections.map((item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    const images = [...item.images];

                    images[imageIndex] = {
                        ...images[imageIndex],
                        src: preview,
                        imageFileName: filename
                    };

                    return {
                        ...item,
                        images
                    };
                })
            }));
        });

        event.target.value = "";
    }

    /*
    ============================================================
    CONTENT ITEMS
    ============================================================
    */

    function addItem(type) {
        const item = createItem(type);

        setArticle((previous) => ({
            ...previous,
            sections: [
                ...previous.sections,
                item
            ]
        }));
    }

    function updateItem(itemId, changes) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map((item) =>
                item.id === itemId
                    ? {
                        ...item,
                        ...changes
                    }
                    : item
            )
        }));
    }

    function deleteItem(itemId) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.filter(
                (item) => item.id !== itemId
            )
        }));
    }

    function moveItem(itemId, direction) {
        setArticle((previous) => {
            const items = [...previous.sections];

            const index = items.findIndex(
                (item) => item.id === itemId
            );

            if (index === -1) {
                return previous;
            }

            const newIndex =
                direction === "up"
                    ? index - 1
                    : index + 1;

            if (
                newIndex < 0 ||
                newIndex >= items.length
            ) {
                return previous;
            }

            [
                items[index],
                items[newIndex]
            ] = [
                items[newIndex],
                items[index]
            ];

            return {
                ...previous,
                sections: items
            };
        });
    }

    /*
    ============================================================
    LIST ITEMS
    ============================================================
    */

    function updateListItem(
        itemId,
        index,
        value
    ) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    const items = [
                        ...item.items
                    ];

                    items[index] = value;

                    return {
                        ...item,
                        items
                    };
                }
            )
        }));
    }

    function addListItem(itemId) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    return {
                        ...item,
                        items: [
                            ...item.items,
                            ""
                        ]
                    };
                }
            )
        }));
    }

    function deleteListItem(
        itemId,
        index
    ) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    return {
                        ...item,

                        items: item.items.filter(
                            (_, itemIndex) =>
                                itemIndex !== index
                        )
                    };
                }
            )
        }));
    }

    /*
    ============================================================
    URL LIST ITEMS
    ============================================================
    */

    function updateUrlListItem(
        itemId,
        index,
        field,
        value
    ) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    const urls = [
                        ...item.urls
                    ];

                    urls[index] = {
                        ...urls[index],
                        [field]: value
                    };

                    return {
                        ...item,
                        urls
                    };
                }
            )
        }));
    }

    function addUrlListItem(itemId) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    return {
                        ...item,

                        urls: [
                            ...item.urls,
                            {
                                url: "",
                                text: ""
                            }
                        ]
                    };
                }
            )
        }));
    }

    function deleteUrlListItem(
        itemId,
        index
    ) {
        setArticle((previous) => ({
            ...previous,

            sections: previous.sections.map(
                (item) => {
                    if (item.id !== itemId) {
                        return item;
                    }

                    return {
                        ...item,

                        urls: item.urls.filter(
                            (_, urlIndex) =>
                                urlIndex !== index
                        )
                    };
                }
            )
        }));
    }

    /*
    ============================================================
    IMPORT
    ============================================================
    */

    async function importArticle(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        try {
            let text = await file.text();

            /*
             * Remove ES module imports.
             *
             * This allows imports such as:
             *
             * import { getArticleImage }
             * from "../../../data/articleAssets";
             */

            text = text.replace(
                /^\s*import[\s\S]*?;\s*/m,
                ""
            );

            /*
             * Remove:
             *
             * export default
             */

            const objectText = text
                .replace(
                    /^\s*export\s+default\s+/,
                    ""
                )
                .replace(
                    /;\s*$/,
                    ""
                )
                .trim();

            /*
             * Evaluate the exported object while
             * providing getArticleImage().
             */

            const importedArticle =
                Function(
                    "getArticleImage",
                    `"use strict"; return (${objectText});`
                )(
                    getArticleImage
                );

            if (
                !importedArticle ||
                typeof importedArticle !== "object"
            ) {
                throw new Error(
                    "The file does not contain a valid article object."
                );
            }

            if (!importedArticle.id) {
                throw new Error(
                    "The article is missing an id."
                );
            }

            if (!importedArticle.title) {
                throw new Error(
                    "The article is missing a title."
                );
            }

            /*
             * Give sections editor-only IDs.
             */

            const sections =
                Array.isArray(importedArticle.sections)
                    ? importedArticle.sections.map(
                        (section) => ({
                            ...section,
                            id:
                                section.id ||
                                createId()
                        })
                    )
                    : [];

            /*
             * Convert imported image references into
             * actual browser URLs for the editor.
             *
             * The exported article uses:
             *
             * getArticleImage(
             *     articleId,
             *     filename
             * )
             *
             * The editor needs the resolved URL.
             */

            const resolveImage = (
                value
            ) => {
                if (
                    typeof value !== "string"
                ) {
                    return {
                        src: "",
                        imageFileName: ""
                    };
                }

                return {
                    src: value,
                    imageFileName: ""
                };
            };

            const hero = resolveImage(
                importedArticle.hero
            );

            const processedSections =
                sections.map((section) => {
                    if (
                        section.type === "image"
                    ) {
                        return {
                            ...section,
                            ...resolveImage(
                                section.src
                            )
                        };
                    }

                    if (
                        section.type === "gallery"
                    ) {
                        return {
                            ...section,

                            images:
                                (section.images || []).map(
                                    (image) => ({
                                        ...image,
                                        ...resolveImage(
                                            image.src
                                        )
                                    })
                                )
                        };
                    }

                    return section;
                });

            setArticle({
                ...importedArticle,
                hero: hero.src,
                heroFileName:
                    importedArticle.heroFileName || "",
                sections:
                    processedSections
            });

        } catch (error) {
            console.error(
                "Failed to import article:",
                error
            );

            alert(
                `Could not import article:\n\n${error.message}`
            );

        } finally {
            event.target.value = "";
        }
    }

    /*
    ============================================================
    EXPORT
    ============================================================
    */

    function exportArticle() {
        /*
         * Remove editor-only IDs and convert browser
         * preview URLs back into getArticleImage()
         * expressions.
         */

        const formatImageExpression = (
            articleId,
            filename
        ) => {
            if (!filename) {
                return '""';
            }

            return `getArticleImage(${JSON.stringify(
                articleId
            )}, ${JSON.stringify(filename)})`;
        };

        const output = {
            ...article,

            /*
             * heroFileName is editor-only.
             *
             * hero becomes:
             *
             * getArticleImage("article-id", "image.jpg")
             */

            hero: article.heroFileName
                ? {
                    __imageExpression:
                        formatImageExpression(
                            article.id,
                            article.heroFileName
                        )
                }
                : article.hero,

            sections: article.sections.map(
                ({ id, ...item }) => {

                    if (
                        item.type === "image"
                    ) {
                        return {
                            ...item,

                            src: item.imageFileName
                                ? {
                                    __imageExpression:
                                        formatImageExpression(
                                            article.id,
                                            item.imageFileName
                                        )
                                }
                                : item.src
                        };
                    }

                    if (
                        item.type === "gallery"
                    ) {
                        return {
                            ...item,

                            images:
                                item.images.map(
                                    (image) => ({
                                        ...image,

                                        src:
                                            image.imageFileName
                                                ? {
                                                    __imageExpression:
                                                        formatImageExpression(
                                                            article.id,
                                                            image.imageFileName
                                                        )
                                                }
                                                : image.src
                                    })
                                )
                        };
                    }

                    return item;
                }
            )
        };

        /*
         * Remove editor-only image filename fields.
         */

        delete output.heroFileName;

        output.sections =
            output.sections.map(
                (section) => {

                    if (
                        section.type === "image"
                    ) {
                        delete section.imageFileName;
                    }

                    if (
                        section.type === "gallery"
                    ) {
                        section.images =
                            section.images.map(
                                (image) => {
                                    delete image.imageFileName;
                                    return image;
                                }
                            );
                    }

                    return section;
                }
            );

        /*
         * Custom JavaScript formatter.
         *
         * This allows:
         *
         * src: getArticleImage(...)
         *
         * instead of:
         *
         * src: "getArticleImage(...)"
         */

        function formatJavaScript(
            value,
            indent = 0
        ) {
            const spacing =
                " ".repeat(indent);

            const nextSpacing =
                " ".repeat(indent + 4);

            if (
                value === null ||
                typeof value === "boolean" ||
                typeof value === "number"
            ) {
                return String(value);
            }

            if (
                typeof value === "string"
            ) {
                return JSON.stringify(value);
            }

            if (
                typeof value === "object" &&
                value?.__imageExpression
            ) {
                return value.__imageExpression;
            }

            if (Array.isArray(value)) {
                if (value.length === 0) {
                    return "[]";
                }

                return [
                    "[",

                    value
                        .map(
                            (item) =>
                                `${nextSpacing}${formatJavaScript(
                                    item,
                                    indent + 4
                                )}`
                        )
                        .join(",\n"),

                    `${spacing}]`
                ].join("\n");
            }

            if (
                typeof value === "object"
            ) {
                const entries =
                    Object.entries(value);

                if (entries.length === 0) {
                    return "{}";
                }

                return [
                    "{",

                    entries
                        .map(
                            ([key, item]) => {
                                const formattedKey =
                                    /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(
                                        key
                                    )
                                        ? key
                                        : JSON.stringify(
                                            key
                                        );

                                return (
                                    `${nextSpacing}${formattedKey}: ` +
                                    formatJavaScript(
                                        item,
                                        indent + 4
                                    )
                                );
                            }
                        )
                        .join(",\n"),

                    `${spacing}}`
                ].join("\n");
            }

            return "undefined";
        }

        const javascript =
            `import { getArticleImage } from "../../../data/articleAssets";\n\n` +
            `export default ${formatJavaScript(
                output
            )};`;

        const blob = new Blob(
            [javascript],
            {
                type: "text/javascript"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `${article.id || "article"}.js`;

        link.click();

        URL.revokeObjectURL(url);
    }

    /*
    ============================================================
    RENDER
    ============================================================
    */

    return (
        <div className="article-editor scroll">

            {/* =================================================
                EDITOR HEADER
            ================================================= */}

            <header className="editor-header">

                <div>
                    <h1>
                        Article Editor
                    </h1>

                    <p>
                        Create and edit vehicle articles.
                    </p>
                </div>

                <div className="editor-header-actions">

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".js"
                        style={{
                            display: "none"
                        }}
                        onChange={
                            importArticle
                        }
                    />

                    <button
                        type="button"
                        className="editor-import"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        Import JS
                    </button>

                    <button
                        type="button"
                        className="editor-export"
                        onClick={
                            exportArticle
                        }
                    >
                        Export JS
                    </button>

                </div>

            </header>

            <div className="article-editor-layout">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="article-editor-controls">

                    {/* ARTICLE INFORMATION */}

                    <section className="editor-panel">

                        <h2>
                            Article Information
                        </h2>

                        <label>
                            ID (hyphen seperated)

                            <input
                                type="text"
                                value={
                                    article.id
                                }
                                onChange={(event) =>
                                    updateArticle(
                                        "id",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Title

                            <input
                                type="text"
                                value={
                                    article.title
                                }
                                onChange={(event) =>
                                    updateArticle(
                                        "title",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Subtitle

                            <input
                                type="text"
                                value={
                                    article.subtitle
                                }
                                onChange={(event) =>
                                    updateArticle(
                                        "subtitle",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Nation

                            <input
                                type="text"
                                value={
                                    article.nation
                                }
                                onChange={(event) =>
                                    updateArticle(
                                        "nation",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Military Branch (Ground, Air etc)

                            <input
                                type="text"
                                value={
                                    article.branch
                                }
                                onChange={(event) =>
                                    updateArticle(
                                        "branch",
                                        event.target.value
                                    )
                                }
                            />
                        </label>

                        <label>
                            Main Title Image

                            <input
                                type="text"
                                value={
                                    article.heroFileName || ""
                                }
                                readOnly
                                placeholder="No image selected"
                            />

                            <button className="article-editor-image-picker"
                                type="button"
                                onClick={() =>
                                    heroImageInputRef.current?.click()
                                }
                            >
                                Choose Image
                            </button>

                            <input
                                ref={heroImageInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={
                                    handleHeroUpload
                                }
                            />

                            {article.hero && (
                                <img
                                    src={
                                        article.hero
                                    }
                                    alt=""
                                    style={{
                                        maxWidth: "200px",
                                        marginTop: "10px"
                                    }}
                                    onError={(event) => {
                                        event.currentTarget.src =
                                            missingImage;
                                    }}
                                />
                            )}

                        </label>

                    </section>

                    {/* CONTENT */}

                    <section className="editor-panel">

                        <h2>
                            Content
                        </h2>

                        {article.sections.length === 0 && (
                            <p className="empty-editor">
                                No content items yet.
                            </p>
                        )}

                        {article.sections.map(
                            (item, index) => (

                                <div
                                    key={item.id}
                                    className="editor-item"
                                >

                                    <div className="editor-item-header">

                                        <strong>
                                            {item.type}
                                        </strong>

                                        <div>

                                            <button
                                                onClick={() =>
                                                    moveItem(
                                                        item.id,
                                                        "up"
                                                    )
                                                }
                                                disabled={
                                                    index === 0
                                                }
                                            >
                                                ↑
                                            </button>

                                            <button
                                                onClick={() =>
                                                    moveItem(
                                                        item.id,
                                                        "down"
                                                    )
                                                }
                                                disabled={
                                                    index ===
                                                    article.sections.length - 1
                                                }
                                            >
                                                ↓
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>

                                    </div>

                                    {/* HEADING */}

                                    {item.type === "heading" && (
                                        <input
                                            type="text"
                                            placeholder="Heading"
                                            value={
                                                item.content
                                            }
                                            onChange={(event) =>
                                                updateItem(
                                                    item.id,
                                                    {
                                                        content:
                                                            event.target.value
                                                    }
                                                )
                                            }
                                        />
                                    )}

                                    {/* PARAGRAPH */}

                                    {item.type === "paragraph" && (
                                        <textarea
                                            rows="5"
                                            value={
                                                item.content
                                            }
                                            onChange={(event) =>
                                                updateItem(
                                                    item.id,
                                                    {
                                                        content:
                                                            event.target.value
                                                    }
                                                )
                                            }
                                        />
                                    )}

                                    {/* IMAGE */}

                                    {item.type === "image" && (
                                        <div className="nested-editor">

                                            <input
                                                type="text"
                                                value={
                                                    item.imageFileName || ""
                                                }
                                                readOnly
                                                placeholder="No image selected"
                                            />

                                            <button 
                                                className="article-editor-image-picker"
                                                type="button"
                                                onClick={(event) => {
                                                    const input =
                                                        event.currentTarget
                                                            .nextElementSibling;
                                                    input?.click();
                                                }}
                                            >
                                                Choose Image
                                            </button>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(event) =>
                                                    handleSingleImageUpload(
                                                        item.id,
                                                        event
                                                    )
                                                }
                                            />

                                            <input
                                                type="text"
                                                placeholder="Caption"
                                                value={
                                                    item.caption
                                                }
                                                onChange={(event) =>
                                                    updateItem(
                                                        item.id,
                                                        {
                                                            caption:
                                                                event.target.value
                                                        }
                                                    )
                                                }
                                            />

                                            {item.src && (
                                                <img
                                                    src={
                                                        item.src
                                                    }
                                                    alt=""
                                                    style={{
                                                        maxWidth:
                                                            "250px"
                                                    }}
                                                    onError={(event) => {
                                                        event.currentTarget.src =
                                                            missingImage;
                                                    }}
                                                />
                                            )}

                                        </div>
                                    )}

                                    {/* VIDEO */}

                                    {(item.type === "video" ||
                                        item.type === "youtube") && (

                                        <div className="nested-editor">

                                            {item.videos.map(
                                                (
                                                    video,
                                                    videoIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            videoIndex
                                                        }
                                                        className="gallery-editor-item"
                                                    >

                                                        <div className="gallery-editor-header">

                                                            <strong>
                                                                Video{" "}
                                                                {videoIndex + 1}
                                                            </strong>

                                                            <div>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        videoIndex ===
                                                                        0
                                                                    }
                                                                    onClick={() => {

                                                                        const videos =
                                                                            [
                                                                                ...item.videos
                                                                            ];

                                                                        [
                                                                            videos[
                                                                                videoIndex -
                                                                                1
                                                                            ],
                                                                            videos[
                                                                                videoIndex
                                                                            ]
                                                                        ] = [
                                                                            videos[
                                                                                videoIndex
                                                                            ],
                                                                            videos[
                                                                                videoIndex -
                                                                                1
                                                                            ]
                                                                        ];

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                videos
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ↑
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        videoIndex ===
                                                                        item.videos.length -
                                                                        1
                                                                    }
                                                                    onClick={() => {

                                                                        const videos =
                                                                            [
                                                                                ...item.videos
                                                                            ];

                                                                        [
                                                                            videos[
                                                                                videoIndex
                                                                            ],
                                                                            videos[
                                                                                videoIndex +
                                                                                1
                                                                            ]
                                                                        ] = [
                                                                            videos[
                                                                                videoIndex +
                                                                                1
                                                                            ],
                                                                            videos[
                                                                                videoIndex
                                                                            ]
                                                                        ];

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                videos
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ↓
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {

                                                                        const videos =
                                                                            item.videos.filter(
                                                                                (
                                                                                    _,
                                                                                    index
                                                                                ) =>
                                                                                    index !==
                                                                                    videoIndex
                                                                            );

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                videos
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ×
                                                                </button>

                                                            </div>

                                                        </div>

                                                        <input
                                                            type="text"
                                                            placeholder="YouTube video ID or URL"
                                                            value={
                                                                video.id
                                                            }
                                                            onChange={(event) => {

                                                                const videos =
                                                                    [
                                                                        ...item.videos
                                                                    ];

                                                                videos[
                                                                    videoIndex
                                                                ] = {
                                                                    ...videos[
                                                                        videoIndex
                                                                    ],
                                                                    id:
                                                                        event
                                                                            .target
                                                                            .value
                                                                };

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        videos
                                                                    }
                                                                );

                                                            }}
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="Video title"
                                                            value={
                                                                video.title ||
                                                                ""
                                                            }
                                                            onChange={(event) => {

                                                                const videos =
                                                                    [
                                                                        ...item.videos
                                                                    ];

                                                                videos[
                                                                    videoIndex
                                                                ] = {
                                                                    ...videos[
                                                                        videoIndex
                                                                    ],
                                                                    title:
                                                                        event
                                                                            .target
                                                                            .value
                                                                };

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        videos
                                                                    }
                                                                );

                                                            }}
                                                        />

                                                    </div>

                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    updateItem(
                                                        item.id,
                                                        {
                                                            videos: [
                                                                ...item.videos,
                                                                {
                                                                    id: "",
                                                                    title: ""
                                                                }
                                                            ]
                                                        }
                                                    );

                                                }}
                                            >
                                                + Video
                                            </button>

                                        </div>
                                    )}

                                    {/* URL */}

                                    {item.type === "url" && (
                                        <>
                                            <input
                                                type="text"
                                                placeholder="Link text"
                                                value={
                                                    item.text
                                                }
                                                onChange={(event) =>
                                                    updateItem(
                                                        item.id,
                                                        {
                                                            text:
                                                                event.target.value
                                                        }
                                                    )
                                                }
                                            />

                                            <input
                                                type="text"
                                                placeholder="URL"
                                                value={
                                                    item.url
                                                }
                                                onChange={(event) =>
                                                    updateItem(
                                                        item.id,
                                                        {
                                                            url:
                                                                event.target.value
                                                        }
                                                    )
                                                }
                                            />
                                        </>
                                    )}

                                    {/* LIST */}

                                    {item.type === "list" && (
                                        <div className="nested-editor">

                                            {item.items.map(
                                                (
                                                    listItem,
                                                    listIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            listIndex
                                                        }
                                                        className="nested-editor-row"
                                                    >

                                                        <input
                                                            type="text"
                                                            placeholder="List item"
                                                            value={
                                                                listItem
                                                            }
                                                            onChange={(event) =>
                                                                updateListItem(
                                                                    item.id,
                                                                    listIndex,
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <button
                                                            onClick={() =>
                                                                deleteListItem(
                                                                    item.id,
                                                                    listIndex
                                                                )
                                                            }
                                                        >
                                                            ×
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                            <button
                                                onClick={() =>
                                                    addListItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                + List Item
                                            </button>

                                        </div>
                                    )}

                                    {/* URL LIST */}

                                    {item.type === "url-list" && (
                                        <div className="nested-editor">

                                            {item.urls.map(
                                                (
                                                    urlItem,
                                                    urlIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            urlIndex
                                                        }
                                                        className="nested-editor-row"
                                                    >

                                                        <input
                                                            type="text"
                                                            placeholder="Text"
                                                            value={
                                                                urlItem.text
                                                            }
                                                            onChange={(event) =>
                                                                updateUrlListItem(
                                                                    item.id,
                                                                    urlIndex,
                                                                    "text",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="URL"
                                                            value={
                                                                urlItem.url
                                                            }
                                                            onChange={(event) =>
                                                                updateUrlListItem(
                                                                    item.id,
                                                                    urlIndex,
                                                                    "url",
                                                                    event
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <button
                                                            onClick={() =>
                                                                deleteUrlListItem(
                                                                    item.id,
                                                                    urlIndex
                                                                )
                                                            }
                                                        >
                                                            ×
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                            <button
                                                onClick={() =>
                                                    addUrlListItem(
                                                        item.id
                                                    )
                                                }
                                            >
                                                + URL
                                            </button>

                                        </div>
                                    )}

                                    {/* SPECIFICATIONS */}

                                    {item.type === "specifications" && (
                                        <div className="nested-editor">

                                            {item.items.map(
                                                (
                                                    specification,
                                                    specIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            specIndex
                                                        }
                                                        className="specification-editor-row"
                                                    >

                                                        <input
                                                            type="text"
                                                            placeholder="Specification"
                                                            value={
                                                                specification.item
                                                            }
                                                            onChange={(event) => {

                                                                const specifications =
                                                                    [
                                                                        ...item.items
                                                                    ];

                                                                specifications[
                                                                    specIndex
                                                                ] = {
                                                                    ...specifications[
                                                                        specIndex
                                                                    ],
                                                                    item:
                                                                        event
                                                                            .target
                                                                            .value
                                                                };

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        items:
                                                                            specifications
                                                                    }
                                                                );

                                                            }}
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="Value"
                                                            value={
                                                                specification.value
                                                            }
                                                            onChange={(event) => {

                                                                const specifications =
                                                                    [
                                                                        ...item.items
                                                                    ];

                                                                specifications[
                                                                    specIndex
                                                                ] = {
                                                                    ...specifications[
                                                                        specIndex
                                                                    ],
                                                                    value:
                                                                        event
                                                                            .target
                                                                            .value
                                                                };

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        items:
                                                                            specifications
                                                                    }
                                                                );

                                                            }}
                                                        />

                                                        <button
                                                            type="button"
                                                            onClick={() => {

                                                                const specifications =
                                                                    item.items.filter(
                                                                        (
                                                                            _,
                                                                            index
                                                                        ) =>
                                                                            index !==
                                                                            specIndex
                                                                    );

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        items:
                                                                            specifications
                                                                    }
                                                                );

                                                            }}
                                                        >
                                                            ×
                                                        </button>

                                                    </div>

                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    updateItem(
                                                        item.id,
                                                        {
                                                            items: [
                                                                ...item.items,
                                                                {
                                                                    item: "",
                                                                    value: ""
                                                                }
                                                            ]
                                                        }
                                                    );

                                                }}
                                            >
                                                + Specification
                                            </button>

                                        </div>
                                    )}

                                    {/* QUOTE */}

                                    {item.type === "quote" && (
                                        <div className="nested-editor">

                                            <label>
                                                Quote

                                                <textarea
                                                    rows="5"
                                                    value={
                                                        item.content
                                                    }
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.id,
                                                            {
                                                                content:
                                                                    event.target.value
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                            <label>
                                                Author

                                                <input
                                                    type="text"
                                                    value={
                                                        item.author ||
                                                        ""
                                                    }
                                                    onChange={(event) =>
                                                        updateItem(
                                                            item.id,
                                                            {
                                                                author:
                                                                    event.target.value
                                                            }
                                                        )
                                                    }
                                                />
                                            </label>

                                        </div>
                                    )}

                                    {/* GALLERY */}

                                    {item.type === "gallery" && (
                                        <div className="nested-editor">

                                            {item.images.map(
                                                (
                                                    image,
                                                    imageIndex
                                                ) => (

                                                    <div
                                                        key={
                                                            imageIndex
                                                        }
                                                        className="gallery-editor-item"
                                                    >

                                                        <div className="gallery-editor-header">

                                                            <strong>
                                                                Image{" "}
                                                                {imageIndex + 1}
                                                            </strong>

                                                            <div>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        imageIndex ===
                                                                        0
                                                                    }
                                                                    onClick={() => {

                                                                        const images =
                                                                            [
                                                                                ...item.images
                                                                            ];

                                                                        [
                                                                            images[
                                                                                imageIndex -
                                                                                1
                                                                            ],
                                                                            images[
                                                                                imageIndex
                                                                            ]
                                                                        ] = [
                                                                            images[
                                                                                imageIndex
                                                                            ],
                                                                            images[
                                                                                imageIndex -
                                                                                1
                                                                            ]
                                                                        ];

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                images
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ↑
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    disabled={
                                                                        imageIndex ===
                                                                        item.images.length -
                                                                        1
                                                                    }
                                                                    onClick={() => {

                                                                        const images =
                                                                            [
                                                                                ...item.images
                                                                            ];

                                                                        [
                                                                            images[
                                                                                imageIndex
                                                                            ],
                                                                            images[
                                                                                imageIndex +
                                                                                1
                                                                            ]
                                                                        ] = [
                                                                            images[
                                                                                imageIndex +
                                                                                1
                                                                            ],
                                                                            images[
                                                                                imageIndex
                                                                            ]
                                                                        ];

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                images
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ↓
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => {

                                                                        const images =
                                                                            item.images.filter(
                                                                                (
                                                                                    _,
                                                                                    index
                                                                                ) =>
                                                                                    index !==
                                                                                    imageIndex
                                                                            );

                                                                        updateItem(
                                                                            item.id,
                                                                            {
                                                                                images
                                                                            }
                                                                        );

                                                                    }}
                                                                >
                                                                    ×
                                                                </button>

                                                            </div>

                                                        </div>
                                                        
                                                        <input
                                                            type="text"
                                                            value={
                                                                image.imageFileName || ""
                                                            }
                                                            readOnly
                                                            placeholder="No image selected"
                                                        />

                                                        <button className="article-editor-image-picker"
                                                            type="button"
                                                            onClick={(event) => {
                                                                const input =
                                                                    event.currentTarget
                                                                        .nextElementSibling;
                                                                input?.click();
                                                            }}
                                                        >
                                                            Choose Image
                                                        </button>

                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            hidden
                                                            onChange={(event) =>
                                                                handleGalleryImageUpload(
                                                                    item.id,
                                                                    imageIndex,
                                                                    event
                                                                )
                                                            }
                                                        />

                                                        <input
                                                            type="text"
                                                            placeholder="Caption"
                                                            value={
                                                                image.caption ||
                                                                ""
                                                            }
                                                            onChange={(event) => {

                                                                const images =
                                                                    [
                                                                        ...item.images
                                                                    ];

                                                                images[
                                                                    imageIndex
                                                                ] = {
                                                                    ...images[
                                                                        imageIndex
                                                                    ],
                                                                    caption:
                                                                        event
                                                                            .target
                                                                            .value
                                                                };

                                                                updateItem(
                                                                    item.id,
                                                                    {
                                                                        images
                                                                    }
                                                                );

                                                            }}
                                                        />

                                                        {image.src && (
                                                            <img
                                                                src={
                                                                    image.src
                                                                }
                                                                alt=""
                                                                style={{
                                                                    maxWidth:
                                                                        "250px"
                                                                }}
                                                                onError={(event) => {
                                                                    event.currentTarget.src =
                                                                        missingImage;
                                                                }}
                                                            />
                                                        )}

                                                    </div>

                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => {

                                                    updateItem(
                                                        item.id,
                                                        {
                                                            images: [
                                                                ...item.images,
                                                                {
                                                                    src: "",
                                                                    imageFileName: "",
                                                                    caption: ""
                                                                }
                                                            ]
                                                        }
                                                    );

                                                }}
                                            >
                                                + Gallery Image
                                            </button>

                                        </div>
                                    )}

                                </div>
                            )
                        )}

                    </section>

                    {/* ADD CONTENT */}

                    <section className="editor-panel">

                        <h2>
                            Add Content
                        </h2>

                        <div className="add-item-buttons">

                            <button
                                onClick={() =>
                                    addItem("heading")
                                }
                            >
                                + Heading
                            </button>

                            <button
                                onClick={() =>
                                    addItem("paragraph")
                                }
                            >
                                + Paragraph
                            </button>

                            <button
                                onClick={() =>
                                    addItem("list")
                                }
                            >
                                + List
                            </button>

                            <button
                                onClick={() =>
                                    addItem("image")
                                }
                            >
                                + Image
                            </button>

                            <button
                                onClick={() =>
                                    addItem("video")
                                }
                            >
                                + Video
                            </button>

                            <button
                                onClick={() =>
                                    addItem("specifications")
                                }
                            >
                                + Specifications
                            </button>

                            <button
                                onClick={() =>
                                    addItem("quote")
                                }
                            >
                                + Quote
                            </button>

                            <button
                                onClick={() =>
                                    addItem("gallery")
                                }
                            >
                                + Gallery
                            </button>

                            <button
                                onClick={() =>
                                    addItem("url")
                                }
                            >
                                + URL
                            </button>

                            <button
                                onClick={() =>
                                    addItem("url-list")
                                }
                            >
                                + URL List
                            </button>

                        </div>

                    </section>

                </div>

                {/* =================================================
                    RIGHT SIDE — PREVIEW
                ================================================= */}

                <div className="article-editor-preview">

                    <div className="preview-header">

                        <h2>
                            Preview
                        </h2>

                    </div>

                    <article className="article-preview">

                        <header className="article-preview-hero">

                            {article.hero && (
                                <img
                                    src={
                                        article.hero
                                    }
                                    alt=""
                                />
                            )}

                            <h1>
                                {article.title}
                            </h1>

                            {article.subtitle && (
                                <p>
                                    {article.subtitle}
                                </p>
                            )}

                            {(article.nation ||
                                article.branch) && (

                                <small>

                                    {article.nation}

                                    {article.nation &&
                                        article.branch &&
                                        " · "}

                                    {article.branch}

                                </small>
                            )}

                        </header>

                        <div className="article-preview-content">

                            {article.sections.map(
                                (item) => {

                                    if (
                                        item.type ===
                                        "heading"
                                    ) {
                                        return (
                                            <section
                                                key={item.id}
                                            >
                                                <h2>
                                                    {
                                                        item.content
                                                    }
                                                </h2>
                                            </section>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "paragraph"
                                    ) {
                                        return (
                                            <p
                                                key={item.id}
                                            >
                                                {
                                                    item.content
                                                }
                                            </p>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "list"
                                    ) {
                                        return (
                                            <ul
                                                key={item.id}
                                            >
                                                {item.items.map(
                                                    (
                                                        listItem,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            {
                                                                listItem
                                                            }
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "image"
                                    ) {
                                        return (
                                            <figure
                                                key={
                                                    item.id
                                                }
                                            >
                                                {item.src && (
                                                    <img
                                                        src={
                                                            item.src
                                                        }
                                                        alt={
                                                            item.caption ||
                                                            ""
                                                        }
                                                    />
                                                )}

                                                {item.caption && (
                                                    <figcaption>
                                                        {
                                                            item.caption
                                                        }
                                                    </figcaption>
                                                )}
                                            </figure>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "video" ||
                                        item.type ===
                                        "youtube"
                                    ) {
                                        const currentIndex =
                                            videoIndexes[
                                                item.id
                                            ] ?? 0;

                                        const previewVideos =
                                            (
                                                item.videos ??
                                                []
                                            )
                                                .map(
                                                    (video) => ({
                                                        ...video,
                                                        videoId:
                                                            extractYouTubeVideoId(
                                                                video.id ||
                                                                ""
                                                            )
                                                    })
                                                )
                                                .filter(
                                                    (video) =>
                                                        video.videoId
                                                );

                                        if (
                                            !previewVideos.length
                                        ) {
                                            return (
                                                <p
                                                    key={
                                                        item.id
                                                    }
                                                >
                                                    Video not configured.
                                                </p>
                                            );
                                        }

                                        const goToPrevious =
                                            () => {
                                                setVideoIndexes(
                                                    (previous) => ({
                                                        ...previous,

                                                        [item.id]:
                                                            currentIndex ===
                                                            0
                                                                ? previewVideos.length -
                                                                  1
                                                                : currentIndex -
                                                                  1
                                                    })
                                                );
                                            };

                                        const goToNext =
                                            () => {
                                                setVideoIndexes(
                                                    (previous) => ({
                                                        ...previous,

                                                        [item.id]:
                                                            currentIndex ===
                                                            previewVideos.length -
                                                            1
                                                                ? 0
                                                                : currentIndex +
                                                                  1
                                                    })
                                                );
                                            };

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="article-preview-video-carousel"
                                            >

                                                <div className="article-preview-video-carousel-viewport">

                                                    <div
                                                        className="article-preview-video-carousel-track"
                                                        style={{
                                                            transform:
                                                                `translateX(-${currentIndex * 100}%)`
                                                        }}
                                                    >

                                                        {previewVideos.map(
                                                            (
                                                                video,
                                                                index
                                                            ) => (

                                                                <div
                                                                    key={`${video.videoId}-${index}`}
                                                                    className="article-preview-video-carousel-slide"
                                                                >

                                                                    <div className="article-preview-video">

                                                                        <iframe
                                                                            src={`https://www.youtube.com/embed/${video.videoId}`}
                                                                            title={
                                                                                video.title ||
                                                                                "YouTube video"
                                                                            }
                                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                                            allowFullScreen
                                                                        />

                                                                    </div>

                                                                    {video.title && (
                                                                        <p className="article-preview-video-carousel-caption">
                                                                            {
                                                                                video.title
                                                                            }
                                                                        </p>
                                                                    )}

                                                                </div>
                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                                {previewVideos.length >
                                                    1 && (

                                                    <div className="article-preview-video-carousel-controls">

                                                        <button
                                                            type="button"
                                                            className="article-preview-video-carousel-button"
                                                            onClick={
                                                                goToPrevious
                                                            }
                                                            aria-label="Previous video"
                                                        >
                                                            ◀
                                                        </button>

                                                        <span className="article-preview-video-carousel-counter">
                                                            {currentIndex +
                                                                1}{" "}
                                                            /{" "}
                                                            {
                                                                previewVideos.length
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="article-preview-video-carousel-button"
                                                            onClick={
                                                                goToNext
                                                            }
                                                            aria-label="Next video"
                                                        >
                                                            ▶
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "url"
                                    ) {
                                        return (
                                            <p
                                                key={
                                                    item.id
                                                }
                                            >
                                                <a
                                                    href={
                                                        item.url
                                                    }
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {
                                                        item.text
                                                    }
                                                </a>
                                            </p>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "url-list"
                                    ) {
                                        return (
                                            <ul
                                                key={
                                                    item.id
                                                }
                                            >
                                                {item.urls.map(
                                                    (
                                                        urlItem,
                                                        index
                                                    ) => (
                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            <a
                                                                href={
                                                                    urlItem.url
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {
                                                                    urlItem.text
                                                                }
                                                            </a>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "specifications"
                                    ) {
                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="article-preview-specifications"
                                            >

                                                {item.items.map(
                                                    (
                                                        specification,
                                                        index
                                                    ) => (

                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="article-preview-specification"
                                                        >

                                                            <strong>
                                                                {
                                                                    specification.item
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    specification.value
                                                                }
                                                            </span>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "quote"
                                    ) {
                                        return (
                                            <blockquote
                                                key={
                                                    item.id
                                                }
                                                className="article-preview-quote"
                                            >

                                                <p>
                                                    {
                                                        item.content
                                                    }
                                                </p>

                                                {item.author && (
                                                    <cite>
                                                        {
                                                            item.author
                                                        }
                                                    </cite>
                                                )}

                                            </blockquote>
                                        );
                                    }

                                    if (
                                        item.type ===
                                        "gallery"
                                    ) {
                                        const currentIndex =
                                            galleryIndexes[
                                                item.id
                                            ] ?? 0;

                                        const galleryImages =
                                            (
                                                item.images ??
                                                []
                                            ).filter(Boolean);

                                        if (
                                            !galleryImages.length
                                        ) {
                                            return null;
                                        }

                                        const goToPrevious =
                                            () => {
                                                setGalleryIndexes(
                                                    (previous) => ({
                                                        ...previous,

                                                        [item.id]:
                                                            currentIndex ===
                                                            0
                                                                ? galleryImages.length -
                                                                  1
                                                                : currentIndex -
                                                                  1
                                                    })
                                                );
                                            };

                                        const goToNext =
                                            () => {
                                                setGalleryIndexes(
                                                    (previous) => ({
                                                        ...previous,

                                                        [item.id]:
                                                            currentIndex ===
                                                            galleryImages.length -
                                                            1
                                                                ? 0
                                                                : currentIndex +
                                                                  1
                                                    })
                                                );
                                            };

                                        return (
                                            <div
                                                key={
                                                    item.id
                                                }
                                                className="article-preview-gallery"
                                            >

                                                <div className="article-preview-gallery-viewport">

                                                    <div
                                                        className="article-preview-gallery-track"
                                                        style={{
                                                            transform:
                                                                `translateX(-${currentIndex * 100}%)`
                                                        }}
                                                    >

                                                        {galleryImages.map(
                                                            (
                                                                image,
                                                                index
                                                            ) => (

                                                                <figure
                                                                    key={`${image.src || "gallery"}-${index}`}
                                                                    className="article-preview-gallery-slide"
                                                                >

                                                                    {image.src && (
                                                                        <img
                                                                            src={
                                                                                image.src
                                                                            }
                                                                            alt={
                                                                                image.caption ||
                                                                                ""
                                                                            }
                                                                        />
                                                                    )}

                                                                    {image.caption && (
                                                                        <figcaption>
                                                                            {
                                                                                image.caption
                                                                            }
                                                                        </figcaption>
                                                                    )}

                                                                </figure>
                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                                {galleryImages.length >
                                                    1 && (

                                                    <div className="article-preview-gallery-controls">

                                                        <button
                                                            type="button"
                                                            className="article-preview-gallery-button"
                                                            onClick={
                                                                goToPrevious
                                                            }
                                                            aria-label="Previous image"
                                                        >
                                                            ◀
                                                        </button>

                                                        <span className="article-preview-gallery-counter">
                                                            {currentIndex +
                                                                1}{" "}
                                                            /{" "}
                                                            {
                                                                galleryImages.length
                                                            }
                                                        </span>

                                                        <button
                                                            type="button"
                                                            className="article-preview-gallery-button"
                                                            onClick={
                                                                goToNext
                                                            }
                                                            aria-label="Next image"
                                                        >
                                                            ▶
                                                        </button>

                                                    </div>
                                                )}

                                            </div>
                                        );
                                    }

                                    return null;
                                }
                            )}

                        </div>

                    </article>

                </div>

            </div>

        </div>
    );
}