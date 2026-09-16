import { useRef, useState } from "react";
import "./TechTreeEditor.css";

const COLUMN_COUNT = 7;


/* =========================================================
   HELPERS
========================================================= */

function createId(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}


function slugify(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}


function createEmptyColumns(rowCount = 1) {
    return Array.from(
        { length: COLUMN_COUNT },
        (_, index) => ({
            id: `col${index + 1}`,
            items: Array(rowCount).fill(null)
        })
    );
}


function createEmptyTree() {
    return {
        id: "new-tree",
        title: "New Tech Tree",
        description: "",
        ranks: [
            {
                rank: "I",
                columns: createEmptyColumns(1)
            }
        ]
    };
}


/*
 * Convert imported getImage() marker objects back into
 * the filename used internally by the editor.
 */
function normalizeImage(image) {

    if (
        image &&
        typeof image === "object" &&
        image.__treeImage
    ) {
        return image.filename || "";
    }

    return image || "";
}


/* =========================================================
   NORMALIZE TREE
========================================================= */

function normalizeTree(tree) {

    const ranks = Array.isArray(tree?.ranks)
        ? tree.ranks
        : [];

    return {
        id: tree?.id || "new-tree",

        title:
            tree?.title ||
            "New Tech Tree",

        description:
            tree?.description ||
            "",

        ranks: ranks.map(
            (rank, rankIndex) => {

                const sourceColumns =
                    Array.isArray(rank.columns)
                        ? rank.columns
                        : [];

                const columns =
                    Array.from(
                        {
                            length:
                                COLUMN_COUNT
                        },
                        (_, columnIndex) => {

                            const source =
                                sourceColumns[
                                    columnIndex
                                ];

                            if (!source) {
                                return {
                                    id:
                                        `col${columnIndex + 1}`,
                                    items: []
                                };
                            }


                            if (
                                Array.isArray(
                                    source.items
                                )
                            ) {

                                return {
                                    id:
                                        source.id ||
                                        `col${columnIndex + 1}`,

                                    items:
                                        source.items.map(
                                            (item) => {

                                                if (!item) {
                                                    return null;
                                                }


                                                if (
                                                    item.type ===
                                                    "vehicle"
                                                ) {

                                                    return {
                                                        ...item,

                                                        vehicle: {
                                                            ...item.vehicle,

                                                            image:
                                                                normalizeImage(
                                                                    item.vehicle?.image
                                                                )
                                                        }
                                                    };
                                                }


                                                if (
                                                    item.type ===
                                                    "group"
                                                ) {

                                                    return {
                                                        ...item,

                                                        group: {
                                                            ...item.group,

                                                            image:
                                                                normalizeImage(
                                                                    item.group?.image
                                                                ),

                                                            vehicles:
                                                                Array.isArray(
                                                                    item.group?.vehicles
                                                                )
                                                                    ? item.group.vehicles.map(
                                                                        (
                                                                            vehicle
                                                                        ) => ({
                                                                            ...vehicle,

                                                                            image:
                                                                                normalizeImage(
                                                                                    vehicle?.image
                                                                                )
                                                                        })
                                                                    )
                                                                    : []
                                                        }
                                                    };
                                                }


                                                return item;
                                            }
                                        )
                                };
                            }


                            /*
                             * Backwards compatibility with the
                             * older vehicles[] format.
                             */
                            if (
                                Array.isArray(
                                    source.vehicles
                                )
                            ) {

                                return {
                                    id:
                                        source.id ||
                                        `col${columnIndex + 1}`,

                                    items:
                                        source.vehicles.map(
                                            (vehicle) => ({
                                                type:
                                                    "vehicle",

                                                vehicle: {
                                                    ...vehicle,

                                                    image:
                                                        normalizeImage(
                                                            vehicle?.image
                                                        )
                                                }
                                            })
                                        )
                                };
                            }


                            return {
                                id:
                                    source.id ||
                                    `col${columnIndex + 1}`,

                                items: []
                            };
                        }
                    );


                /*
                 * Backwards compatibility with the older
                 * rank.groups[] format.
                 */
                if (
                    Array.isArray(
                        rank.groups
                    )
                ) {

                    rank.groups.forEach(
                        (group) => {

                            columns[0].items.push({
                                type: "group",

                                group: {
                                    ...group,

                                    id:
                                        group.id ||
                                        createId(
                                            "group"
                                        ),

                                    image:
                                        normalizeImage(
                                            group.image
                                        ),

                                    vehicles:
                                        Array.isArray(
                                            group.vehicles
                                        )
                                            ? group.vehicles.map(
                                                (
                                                    vehicle
                                                ) => ({
                                                    ...vehicle,

                                                    image:
                                                        normalizeImage(
                                                            vehicle?.image
                                                        )
                                                })
                                            )
                                            : []
                                }
                            });

                        }
                    );
                }


                return {
                    rank:
                        rank.rank ??
                        String.fromCharCode(
                            73 + rankIndex
                        ),

                    columns
                };
            }
        )
    };
}


/* =========================================================
   EXPORT FORMATTER
========================================================= */

function formatJavaScript(
    value,
    indent = 0
) {

    const spacing =
        " ".repeat(indent);

    const nextSpacing =
        " ".repeat(
            indent + 4
        );


    if (
        value === null ||
        typeof value === "boolean" ||
        typeof value === "number"
    ) {
        return String(value);
    }


    if (typeof value === "string") {
        return JSON.stringify(value);
    }


    if (Array.isArray(value)) {

        if (!value.length) {
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


    if (typeof value === "object") {

        /*
         * Special marker used by the exporter to represent
         * getImage("tree", "filename").
         */
        if (
            value?.__getImage
        ) {

            return (
                `getImage(` +
                `${JSON.stringify(
                    value.treeDirectory
                )}, ` +
                `${JSON.stringify(
                    value.filename
                )}` +
                `)`
            );
        }


        const entries =
            Object.entries(value);

        if (!entries.length) {
            return "{}";
        }


        return [
            "{",

            entries
                .map(
                    ([key, item]) => {

                        const validIdentifier =
                            /^[A-Za-z_$][A-Za-z0-9_$]*$/
                                .test(key);

                        const formattedKey =
                            validIdentifier
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


/* =========================================================
   PREPARE TREE FOR EXPORT
========================================================= */

function prepareTreeForExport(tree) {

    const treeDirectory =
        tree.id || "new-tree";


    return {
        ...tree,

        ranks:
            tree.ranks.map(
                (rank) => ({

                    ...rank,

                    columns:
                        rank.columns.map(
                            (column) => ({

                                ...column,

                                items:
                                    (
                                        column.items ||
                                        []
                                    ).map(
                                        (item) => {

                                            if (!item) {
                                                return null;
                                            }


                                            /*
                                             * VEHICLE
                                             */
                                            if (
                                                item.type ===
                                                "vehicle"
                                            ) {

                                                return {
                                                    ...item,

                                                    vehicle: {
                                                        ...item.vehicle,

                                                        image:
                                                            item.vehicle?.image
                                                                ? {
                                                                    __getImage:
                                                                        true,

                                                                    treeDirectory,

                                                                    filename:
                                                                        item.vehicle.image
                                                                }
                                                                : null
                                                    }
                                                };
                                            }


                                            /*
                                             * GROUP
                                             */
                                            if (
                                                item.type ===
                                                "group"
                                            ) {

                                                return {
                                                    ...item,

                                                    group: {
                                                        ...item.group,

                                                        image:
                                                            item.group?.image
                                                                ? {
                                                                    __getImage:
                                                                        true,

                                                                    treeDirectory,

                                                                    filename:
                                                                        item.group.image
                                                                }
                                                                : null,

                                                        vehicles:
                                                            (
                                                                item.group
                                                                    ?.vehicles ||
                                                                []
                                                            ).map(
                                                                (
                                                                    vehicle
                                                                ) => ({

                                                                    ...vehicle,

                                                                    image:
                                                                        vehicle?.image
                                                                            ? {
                                                                                __getImage:
                                                                                    true,

                                                                                treeDirectory,

                                                                                filename:
                                                                                    vehicle.image
                                                                            }
                                                                            : null
                                                                })
                                                            )
                                                    }
                                                };
                                            }


                                            return item;
                                        }
                                    )
                            })
                        )
                })
            )
    };
}


/* =========================================================
   COMPONENT
========================================================= */

export default function TechTreeEditor() {

    const fileInputRef =
        useRef(null);

    /*
     * Used by all image selectors.
     *
     * We only need the filename from the selected
     * file. The physical file belongs in the tree's
     * assets folder.
     */
    const imageInputRef =
        useRef(null);


    const [tree, setTree] =
        useState(
            createEmptyTree
        );


    /*
     * selectedSlot is used when creating a
     * new vehicle/group in the main tree.
     */
    const [selectedSlot, setSelectedSlot] =
        useState(null);


    /*
     * selectedEditor identifies something
     * that is already in the tree and is
     * being edited.
     */
    const [selectedEditor, setSelectedEditor] =
        useState(null);


    const [itemType, setItemType] =
        useState("vehicle");


    const [itemForm, setItemForm] =
        useState({
            name: "",
            image: "",
            description: ""
        });


    /* =====================================================
       TREE INFORMATION
    ===================================================== */

    function updateTreeField(
        field,
        value
    ) {

        setTree(
            (previous) => ({
                ...previous,
                [field]: value
            })
        );
    }


    /* =====================================================
       FORM
    ===================================================== */

    function updateItemForm(
        field,
        value
    ) {

        setItemForm(
            (previous) => ({
                ...previous,
                [field]: value
            })
        );
    }


    function resetItemForm() {

        setItemForm({
            name: "",
            image: "",
            description: ""
        });
    }


    /*
     * Image picker used for vehicles and groups.
     *
     * The editor stores only file.name.
     */
    function selectImage(event) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        updateItemForm(
            "image",
            file.name
        );

        /*
         * Allows selecting the same file again later.
         */
        event.target.value = "";
    }


    /*
     * Image picker used by vehicles inside a group.
     */
    function selectGroupVehicleImage(
        vehicleIndex,
        event
    ) {

        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        updateGroupVehicle(
            vehicleIndex,
            "image",
            file.name
        );

        event.target.value = "";
    }


    function triggerImagePicker() {

        imageInputRef.current?.click();
    }


    /* =====================================================
       RANKS
    ===================================================== */

    function addRank() {

        setTree(
            (previous) => {

                const nextRankNumber =
                    previous.ranks.length + 1;

                return {
                    ...previous,

                    ranks: [
                        ...previous.ranks,

                        {
                            rank:
                                String(
                                    nextRankNumber
                                ),

                            columns:
                                createEmptyColumns(
                                    1
                                )
                        }
                    ]
                };
            }
        );
    }


    function deleteRank(
        rankIndex
    ) {

        if (
            tree.ranks.length === 1
        ) {
            return;
        }


        if (
            !window.confirm(
                `Delete Rank ${tree.ranks[rankIndex].rank}?`
            )
        ) {
            return;
        }


        setTree(
            (previous) => ({
                ...previous,

                ranks:
                    previous.ranks.filter(
                        (_, index) =>
                            index !==
                            rankIndex
                    )
            })
        );
    }


    function updateRankName(
        rankIndex,
        value
    ) {

        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            index
                        ) =>
                            index ===
                            rankIndex
                                ? {
                                    ...rank,
                                    rank: value
                                }
                                : rank
                    )
            })
        );
    }


    /* =====================================================
       ROWS
    ===================================================== */

    function addRow(
        rankIndex
    ) {

        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            index
                        ) => {

                            if (
                                index !==
                                rankIndex
                            ) {
                                return rank;
                            }


                            return {
                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column
                                        ) => ({

                                            ...column,

                                            items: [
                                                ...(
                                                    column.items ||
                                                    []
                                                ),

                                                null
                                            ]
                                        })
                                    )
                            };
                        }
                    )
            })
        );
    }


    function deleteRow(
        rankIndex,
        rowIndex
    ) {

        const rank =
            tree.ranks[
                rankIndex
            ];


        const hasContent =
            rank.columns.some(
                (column) =>
                    column.items?.[
                        rowIndex
                    ]
            );


        if (
            hasContent &&
            !window.confirm(
                "This row contains vehicles or groups. Delete it anyway?"
            )
        ) {
            return;
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            index
                        ) => {

                            if (
                                index !==
                                rankIndex
                            ) {
                                return rank;
                            }


                            return {
                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column
                                        ) => ({

                                            ...column,

                                            items:
                                                column.items.filter(
                                                    (
                                                        _,
                                                        index
                                                    ) =>
                                                        index !==
                                                        rowIndex
                                                )
                                        })
                                    )
                            };
                        }
                    )
            })
        );
    }


    /* =====================================================
       MAIN TREE ITEM CREATION
    ===================================================== */

    function openSlot(
        rankIndex,
        columnIndex,
        rowIndex
    ) {

        setSelectedEditor(null);

        setSelectedSlot({
            rankIndex,
            columnIndex,
            rowIndex
        });

        setItemType("vehicle");

        resetItemForm();
    }


    function closeEditor() {

        setSelectedSlot(null);
        setSelectedEditor(null);

        resetItemForm();
    }


    function createMainTreeItem() {

        if (!selectedSlot) {
            return;
        }


        const name =
            itemForm.name.trim();


        if (!name) {
            alert(
                "Please enter a name."
            );

            return;
        }


        const baseId =
            slugify(name) ||
            createId("vehicle");


        let newItem;


        if (
            itemType ===
            "vehicle"
        ) {

            newItem = {

                type:
                    "vehicle",

                vehicle: {

                    id:
                        baseId,

                    name,

                    image:
                        itemForm.image.trim() ||
                        null,

                    description:
                        itemForm.description.trim()
                }
            };

        } else {

            newItem = {

                type:
                    "group",

                group: {

                    id:
                        `${baseId}-group`,

                    title:
                        name,

                    image: null,

                    description:
                        itemForm.description.trim(),

                    vehicles:
                        []
                }
            };
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedSlot.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedSlot.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            items[
                                                selectedSlot.rowIndex
                                            ] =
                                                newItem;


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );


        closeEditor();
    }


    /* =====================================================
       EDIT MAIN TREE ITEM
    ===================================================== */

    function editMainItem(
        rankIndex,
        columnIndex,
        rowIndex,
        item
    ) {

        setSelectedSlot(null);


        setSelectedEditor({

            location:
                "tree",

            rankIndex,

            columnIndex,

            rowIndex
        });


        if (
            item.type ===
            "vehicle"
        ) {

            setItemType(
                "vehicle"
            );


            setItemForm({

                name:
                    item.vehicle.name ||
                    "",

                image:
                    normalizeImage(
                        item.vehicle.image
                    ),

                description:
                    item.vehicle.description ||
                    ""
            });

        } else {

            setItemType(
                "group"
            );


            setItemForm({

                name:
                    item.group.title ||
                    "",

                image:
                    normalizeImage(
                        item.group.image
                    ),

                description:
                    item.group.description ||
                    ""
            });
        }
    }


    function saveMainItem() {

        if (!selectedEditor) {
            return;
        }


        const name =
            itemForm.name.trim();


        if (!name) {

            alert(
                "Please enter a name."
            );

            return;
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedEditor.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedEditor.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            const item =
                                                items[
                                                    selectedEditor.rowIndex
                                                ];


                                            if (!item) {
                                                return column;
                                            }


                                            if (
                                                item.type ===
                                                "vehicle"
                                            ) {

                                                items[
                                                    selectedEditor.rowIndex
                                                ] = {

                                                    ...item,

                                                    vehicle: {

                                                        ...item.vehicle,

                                                        name,

                                                        image:
                                                            itemForm.image.trim() ||
                                                            null,

                                                        description:
                                                            itemForm.description.trim()
                                                    }
                                                };

                                            } else {

                                                items[
                                                    selectedEditor.rowIndex
                                                ] = {

                                                    ...item,

                                                    group: {

                                                        ...item.group,

                                                        title:
                                                            name,

                                                        image: null,

                                                        description:
                                                            itemForm.description.trim()
                                                    }
                                                };
                                            }


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );


        closeEditor();
    }


    /* =====================================================
       REMOVE MAIN ITEM
    ===================================================== */

    function removeItem(
        rankIndex,
        columnIndex,
        rowIndex
    ) {

        if (
            !window.confirm(
                "Remove this item from the tree?"
            )
        ) {
            return;
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rIndex
                        ) => {

                            if (
                                rIndex !==
                                rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            cIndex
                                        ) => {

                                            if (
                                                cIndex !==
                                                columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            items[
                                                rowIndex
                                            ] = null;


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );
    }


    /* =====================================================
       GROUP VEHICLES
    ===================================================== */

    function getSelectedGroup() {

        if (
            !selectedEditor ||
            selectedEditor.location !==
                "group"
        ) {
            return null;
        }


        const rank =
            tree.ranks[
                selectedEditor.rankIndex
            ];


        const column =
            rank?.columns[
                selectedEditor.columnIndex
            ];


        const item =
            column?.items[
                selectedEditor.rowIndex
            ];


        if (
            item?.type !==
            "group"
        ) {
            return null;
        }


        return item.group;
    }


    function openGroupEditor(
        rankIndex,
        columnIndex,
        rowIndex
    ) {

        const group =
            tree.ranks[
                rankIndex
            ]?.columns[
                columnIndex
            ]?.items[
                rowIndex
            ]?.group;


        if (!group) {
            return;
        }


        setSelectedSlot(null);


        setSelectedEditor({

            location:
                "group",

            rankIndex,

            columnIndex,

            rowIndex
        });


        setItemType(
            "group"
        );


        setItemForm({

            name:
                group.title ||
                "",

            image:
                normalizeImage(
                    group.image
                ),

            description:
                group.description ||
                ""
        });
    }


    function addVehicleToGroup() {

        const group =
            getSelectedGroup();


        if (!group) {
            return;
        }


        const newVehicle = {

            id:
                createId(
                    "vehicle"
                ),

            name:
                "New Vehicle",

            image:
                null,

            description:
                ""
        };


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedEditor.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedEditor.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            const item =
                                                items[
                                                    selectedEditor.rowIndex
                                                ];


                                            if (
                                                !item ||
                                                item.type !==
                                                    "group"
                                            ) {
                                                return column;
                                            }


                                            items[
                                                selectedEditor.rowIndex
                                            ] = {

                                                ...item,

                                                group: {

                                                    ...item.group,

                                                    vehicles: [
                                                        ...(item.group
                                                            .vehicles ||
                                                            []),

                                                        newVehicle
                                                    ]
                                                }
                                            };


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );
    }


    function updateGroupVehicle(
        vehicleIndex,
        field,
        value
    ) {

        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedEditor.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedEditor.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            const item =
                                                items[
                                                    selectedEditor.rowIndex
                                                ];


                                            if (
                                                !item ||
                                                item.type !==
                                                    "group"
                                            ) {
                                                return column;
                                            }


                                            const vehicles =
                                                [
                                                    ...(item.group
                                                        .vehicles ||
                                                        [])
                                                ];


                                            vehicles[
                                                vehicleIndex
                                            ] = {

                                                ...vehicles[
                                                    vehicleIndex
                                                ],

                                                [field]:
                                                    field ===
                                                        "image" &&
                                                    !String(
                                                        value
                                                    ).trim()
                                                        ? null
                                                        : value
                                            };


                                            items[
                                                selectedEditor.rowIndex
                                            ] = {

                                                ...item,

                                                group: {

                                                    ...item.group,

                                                    vehicles
                                                }
                                            };


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );
    }


    function removeGroupVehicle(
        vehicleIndex
    ) {

        if (
            !window.confirm(
                "Remove this vehicle from the group?"
            )
        ) {
            return;
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedEditor.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedEditor.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            const item =
                                                items[
                                                    selectedEditor.rowIndex
                                                ];


                                            if (
                                                !item ||
                                                item.type !==
                                                    "group"
                                            ) {
                                                return column;
                                            }


                                            items[
                                                selectedEditor.rowIndex
                                            ] = {

                                                ...item,

                                                group: {

                                                    ...item.group,

                                                    vehicles:
                                                        item.group
                                                            .vehicles
                                                            .filter(
                                                                (
                                                                    _,
                                                                    index
                                                                ) =>
                                                                    index !==
                                                                    vehicleIndex
                                                            )
                                                }
                                            };


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );
    }


    function saveGroup() {

        if (!selectedEditor) {
            return;
        }


        const name =
            itemForm.name.trim();


        if (!name) {

            alert(
                "Please enter a group name."
            );

            return;
        }


        setTree(
            (previous) => ({

                ...previous,

                ranks:
                    previous.ranks.map(
                        (
                            rank,
                            rankIndex
                        ) => {

                            if (
                                rankIndex !==
                                selectedEditor.rankIndex
                            ) {
                                return rank;
                            }


                            return {

                                ...rank,

                                columns:
                                    rank.columns.map(
                                        (
                                            column,
                                            columnIndex
                                        ) => {

                                            if (
                                                columnIndex !==
                                                selectedEditor.columnIndex
                                            ) {
                                                return column;
                                            }


                                            const items =
                                                [
                                                    ...(column.items || [])
                                                ];


                                            const item =
                                                items[
                                                    selectedEditor.rowIndex
                                                ];


                                            if (
                                                !item ||
                                                item.type !==
                                                    "group"
                                            ) {
                                                return column;
                                            }


                                            items[
                                                selectedEditor.rowIndex
                                            ] = {

                                                ...item,

                                                group: {

                                                    ...item.group,

                                                    title:
                                                        name,

                                                    image: null,

                                                    description:
                                                        itemForm.description.trim()
                                                }
                                            };


                                            return {
                                                ...column,
                                                items
                                            };
                                        }
                                    )
                            };
                        }
                    )
            })
        );


        closeEditor();
    }


    /* =====================================================
       IMPORT
    ===================================================== */

    async function importTree(event) {

        const file =
            event.target.files?.[0];


        if (!file) {
            return;
        }


        try {

            let text =
                await file.text();


            /*
             * Remove the getImage import generated by
             * this editor.
             *
             * This also makes the importer compatible
             * with exported tree files regardless of
             * the relative import path.
             */
            text =
                text.replace(
                    /^\s*import\s+\{\s*getImage\s*\}\s+from\s+["'][^"']+["'];\s*/m,
                    ""
                );


            /*
             * Remove export default.
             */
            text =
                text
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
             * Instead of executing the real getImage()
             * during import, return a marker object.
             *
             * This lets the editor recover:
             *
             * getImage("Gr_PkBd", "sgm.jpeg")
             *
             * as:
             *
             * "sgm.jpeg"
             *
             * internally.
             */
            function importGetImage(
                treeDirectory,
                filename
            ) {

                return {
                    __treeImage: true,
                    treeDirectory,
                    filename
                };
            }


            const importedTree =
                Function(
                    "getImage",

                    `"use strict"; return (${text});`
                )(
                    importGetImage
                );


            if (
                !importedTree ||
                typeof importedTree !==
                    "object"
            ) {

                throw new Error(
                    "The file does not contain a valid tech tree."
                );
            }


            setTree(
                normalizeTree(
                    importedTree
                )
            );

        } catch (error) {

            console.error(
                "Failed to import tech tree:",
                error
            );


            alert(
                `Could not import tech tree:\n\n${error.message}`
            );

        } finally {

            event.target.value = "";
        }
    }


    /* =====================================================
       EXPORT
    ===================================================== */

    function exportTree() {

        const exportTreeData =
            prepareTreeForExport(
                tree
            );


        const javascript =
            `import { getImage } from "../../../../data/techTreeAssets";

export default ${formatJavaScript(
                exportTreeData
            )};
`;


        const blob =
            new Blob(
                [javascript],
                {
                    type:
                        "text/javascript"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            `${tree.id || "tech-tree"}.js`;


        link.click();


        URL.revokeObjectURL(
            url
        );
    }


    /* =====================================================
       RENDER
    ===================================================== */

    const editingGroup =
        selectedEditor?.location ===
        "group";


    const selectedGroup =
        editingGroup
            ? getSelectedGroup()
            : null;


    return (

        <div className="tech-tree-editor">

            <header className="tech-tree-editor-header">

                <div>

                    <h1>
                        Tech Tree Editor
                    </h1>

                    <p>
                        Create and arrange vehicles
                        and groups in a seven-column
                        tech tree.
                    </p>

                </div>


                <div className="tech-tree-editor-actions">

                    <button
                        type="button"
                        onClick={() =>
                            fileInputRef.current?.click()
                        }
                    >
                        Import
                    </button>


                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".js"
                        hidden
                        onChange={
                            importTree
                        }
                    />


                    <button
                        type="button"
                        onClick={
                            exportTree
                        }
                    >
                        Export
                    </button>

                </div>

            </header>


            {/* =================================================
                TREE INFORMATION
            ================================================= */}

            <section className="tree-editor-panel">

                <h2>
                    Tree Information
                </h2>


                <div className="tree-editor-form">

                    <label>

                        ID

                        <input
                            type="text"
                            value={
                                tree.id
                            }
                            onChange={(event) =>
                                updateTreeField(
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
                                tree.title
                            }
                            onChange={(event) =>
                                updateTreeField(
                                    "title",
                                    event.target.value
                                )
                            }
                        />

                    </label>


                    <label>

                        Description

                        <textarea
                            value={
                                tree.description
                            }
                            onChange={(event) =>
                                updateTreeField(
                                    "description",
                                    event.target.value
                                )
                            }
                        />

                    </label>

                </div>

            </section>


            {/* =================================================
                RANKS
            ================================================= */}

            <div className="tree-editor-ranks">

                {tree.ranks.map(
                    (
                        rank,
                        rankIndex
                    ) => (

                        <section
                            key={rankIndex}
                            className="tree-editor-rank"
                        >

                            <header className="tree-editor-rank-header">

                                <input
                                    className="tree-editor-rank-name"
                                    value={
                                        rank.rank
                                    }
                                    onChange={(event) =>
                                        updateRankName(
                                            rankIndex,
                                            event.target.value
                                        )
                                    }
                                />


                                <span>
                                    Rank
                                </span>


                                <button
                                    type="button"
                                    className="danger-button"
                                    onClick={() =>
                                        deleteRank(
                                            rankIndex
                                        )
                                    }
                                >
                                    Delete Rank
                                </button>

                            </header>


                            <div className="tree-editor-grid">

                                {Array.from(
                                    {
                                        length:
                                            Math.max(
                                                1,

                                                ...rank.columns.map(
                                                    (
                                                        column
                                                    ) =>
                                                        column.items?.length ||
                                                        0
                                                )
                                            )
                                    },

                                    (
                                        _,
                                        rowIndex
                                    ) => (

                                        <div
                                            className="tree-editor-row"
                                            key={
                                                rowIndex
                                            }
                                        >

                                            {rank.columns.map(
                                                (
                                                    column,
                                                    columnIndex
                                                ) => {

                                                    const item =
                                                        column.items?.[
                                                            rowIndex
                                                        ] ??
                                                        null;


                                                    return (

                                                        <div
                                                            className="tree-editor-cell"
                                                            key={
                                                                column.id
                                                            }
                                                        >

                                                            {!item ? (

                                                                <button
                                                                    type="button"
                                                                    className="tree-editor-empty-slot"
                                                                    onClick={() =>
                                                                        openSlot(
                                                                            rankIndex,
                                                                            columnIndex,
                                                                            rowIndex
                                                                        )
                                                                    }
                                                                >
                                                                    +
                                                                </button>

                                                            ) : (

                                                                <div className="tree-editor-item">

                                                                    <div className="tree-editor-item-type">
                                                                        {item.type}
                                                                    </div>


                                                                    <strong>

                                                                        {item.type ===
                                                                        "vehicle"
                                                                            ? item.vehicle.name
                                                                            : item.group.title}

                                                                    </strong>


                                                                    <div className="tree-editor-item-actions">

                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                editMainItem(
                                                                                    rankIndex,
                                                                                    columnIndex,
                                                                                    rowIndex,
                                                                                    item
                                                                                )
                                                                            }
                                                                        >
                                                                            Edit
                                                                        </button>


                                                                        {item.type ===
                                                                            "group" && (

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    openGroupEditor(
                                                                                        rankIndex,
                                                                                        columnIndex,
                                                                                        rowIndex
                                                                                    )
                                                                                }
                                                                            >
                                                                                Contents
                                                                            </button>

                                                                        )}


                                                                        <button
                                                                            type="button"
                                                                            className="tree-editor-remove"
                                                                            onClick={() =>
                                                                                removeItem(
                                                                                    rankIndex,
                                                                                    columnIndex,
                                                                                    rowIndex
                                                                                )
                                                                            }
                                                                        >
                                                                            ×
                                                                        </button>

                                                                    </div>

                                                                </div>

                                                            )}

                                                        </div>
                                                    );
                                                }
                                            )}


                                            <button
                                                type="button"
                                                className="tree-editor-delete-row"
                                                onClick={() =>
                                                    deleteRow(
                                                        rankIndex,
                                                        rowIndex
                                                    )
                                                }
                                            >
                                                ×
                                            </button>

                                        </div>
                                    )
                                )}

                            </div>


                            <button
                                type="button"
                                className="tree-editor-add-row"
                                onClick={() =>
                                    addRow(
                                        rankIndex
                                    )
                                }
                            >
                                + Add Row
                            </button>

                        </section>
                    )
                )}

            </div>


            <button
                type="button"
                className="tree-editor-add-rank"
                onClick={
                    addRank
                }
            >
                + Add Rank
            </button>


            {/* =================================================
                EDIT EXISTING MAIN ITEM
            ================================================= */}

            {selectedEditor &&
                !editingGroup && (

                    <div
                        className="tree-editor-modal-backdrop"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeEditor();
                            }

                        }}
                    >

                        <div className="tree-editor-modal">

                            <header>

                                <h2>
                                    Edit {
                                        itemType ===
                                        "vehicle"
                                            ? "Vehicle"
                                            : "Group"
                                    }
                                </h2>


                                <button
                                    type="button"
                                    onClick={
                                        closeEditor
                                    }
                                >
                                    ×
                                </button>

                            </header>


                            <label>

                                {
                                    itemType ===
                                    "vehicle"
                                        ? "Vehicle Name"
                                        : "Group Name"
                                }


                                <input
                                    autoFocus
                                    type="text"
                                    value={
                                        itemForm.name
                                    }
                                    onChange={(event) =>
                                        updateItemForm(
                                            "name",
                                            event.target.value
                                        )
                                    }
                                />

                            </label>


                            {itemType === "vehicle" && (
                                <label>

                                    Image


                                    <div className="tree-editor-image-picker">

                                        <input
                                            type="text"
                                            value={
                                                itemForm.image
                                            }
                                            readOnly
                                            placeholder="No image selected"
                                        />


                                        <button
                                            type="button"
                                            onClick={
                                                triggerImagePicker
                                            }
                                        >
                                            Choose Image
                                        </button>


                                        <input
                                            ref={
                                                imageInputRef
                                            }
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={
                                                selectImage
                                            }
                                        />

                                    </div>

                                </label>
                            )}


                            <label>

                                Description

                                <textarea
                                    value={
                                        itemForm.description
                                    }
                                    onChange={(event) =>
                                        updateItemForm(
                                            "description",
                                            event.target.value
                                        )
                                    }
                                />

                            </label>


                            <footer>

                                <button
                                    type="button"
                                    onClick={
                                        closeEditor
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        saveMainItem
                                    }
                                >
                                    Save Changes
                                </button>

                            </footer>

                        </div>

                    </div>
                )}


            {/* =================================================
                CREATE NEW MAIN TREE ITEM
            ================================================= */}

            {selectedSlot && (

                <div
                    className="tree-editor-modal-backdrop"
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeEditor();
                        }

                    }}
                >

                    <div className="tree-editor-modal">

                        <header>

                            <h2>
                                Create Tech Tree Item
                            </h2>


                            <button
                                type="button"
                                onClick={
                                    closeEditor
                                }
                            >
                                ×
                            </button>

                        </header>


                        <div className="tree-editor-type-selector">

                            <button
                                type="button"
                                className={
                                    itemType ===
                                    "vehicle"
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    setItemType(
                                        "vehicle"
                                    )
                                }
                            >
                                Vehicle
                            </button>


                            <button
                                type="button"
                                className={
                                    itemType ===
                                    "group"
                                        ? "selected"
                                        : ""
                                }
                                onClick={() =>
                                    setItemType(
                                        "group"
                                    )
                                }
                            >
                                Group
                            </button>

                        </div>


                        <label>

                            {
                                itemType ===
                                "vehicle"
                                    ? "Vehicle Name"
                                    : "Group Name"
                            }


                            <input
                                autoFocus
                                type="text"
                                value={
                                    itemForm.name
                                }
                                onChange={(event) =>
                                    updateItemForm(
                                        "name",
                                        event.target.value
                                    )
                                }
                            />

                        </label>


                        {itemType === "vehicle" && (
                            <label>

                                Image


                                <div className="tree-editor-image-picker">

                                    <input
                                        type="text"
                                        value={
                                            itemForm.image
                                        }
                                        readOnly
                                        placeholder="No image selected"
                                    />


                                    <button
                                        type="button"
                                        onClick={
                                            triggerImagePicker
                                        }
                                    >
                                        Choose Image
                                    </button>


                                    <input
                                        ref={
                                            imageInputRef
                                        }
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={
                                            selectImage
                                        }
                                    />

                                </div>

                            </label>
                        )}


                        <label>

                            Description

                            <textarea
                                value={
                                    itemForm.description
                                }
                                onChange={(event) =>
                                    updateItemForm(
                                        "description",
                                        event.target.value
                                    )
                                }
                            />

                        </label>


                        <footer>

                            <button
                                type="button"
                                onClick={
                                    closeEditor
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="primary-button"
                                onClick={
                                    createMainTreeItem
                                }
                            >
                                Create
                            </button>

                        </footer>

                    </div>

                </div>
            )}


            {/* =================================================
                GROUP EDITOR
            ================================================= */}

            {editingGroup &&
                selectedGroup && (

                    <div
                        className="tree-editor-modal-backdrop"
                        onMouseDown={(event) => {

                            if (
                                event.target ===
                                event.currentTarget
                            ) {
                                closeEditor();
                            }

                        }}
                    >

                        <div className="tree-editor-group-modal">

                            <header className="tree-editor-modal-header">

                                <div>

                                    <h2>
                                        Edit Group
                                    </h2>

                                    <p>
                                        Edit the group and
                                        manage the vehicles
                                        inside it.
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        closeEditor
                                    }
                                >
                                    ×
                                </button>

                            </header>


                            {/* GROUP DETAILS */}

                            <section className="group-editor-details">

                                <label>

                                    Group Name

                                    <input
                                        type="text"
                                        value={
                                            itemForm.name
                                        }
                                        onChange={(event) =>
                                            updateItemForm(
                                                "name",
                                                event.target.value
                                            )
                                        }
                                    />

                                </label>


                                <label>

                                    Group Description

                                    <textarea
                                        value={
                                            itemForm.description
                                        }
                                        onChange={(event) =>
                                            updateItemForm(
                                                "description",
                                                event.target.value
                                            )
                                        }
                                    />

                                </label>

                            </section>


                            {/* GROUP VEHICLES */}

                            <section className="group-editor-vehicles">

                                <div className="group-editor-vehicles-header">

                                    <h3>
                                        Vehicles
                                    </h3>


                                    <button
                                        type="button"
                                        onClick={
                                            addVehicleToGroup
                                        }
                                    >
                                        + Add Vehicle
                                    </button>

                                </div>


                                {selectedGroup.vehicles?.length ===
                                    0 && (

                                    <div className="group-editor-empty">

                                        This group contains
                                        no vehicles yet.

                                    </div>
                                )}


                                {selectedGroup.vehicles?.map(
                                    (
                                        vehicle,
                                        vehicleIndex
                                    ) => (

                                        <div
                                            className="group-editor-vehicle"
                                            key={
                                                vehicle.id ||
                                                vehicleIndex
                                            }
                                        >

                                            <div className="group-editor-vehicle-number">

                                                {
                                                    vehicleIndex +
                                                    1
                                                }

                                            </div>


                                            <div className="group-editor-vehicle-fields">

                                                <label>

                                                    Vehicle Name

                                                    <input
                                                        type="text"
                                                        value={
                                                            vehicle.name ||
                                                            ""
                                                        }
                                                        onChange={(event) =>
                                                            updateGroupVehicle(
                                                                vehicleIndex,
                                                                "name",
                                                                event.target.value
                                                            )
                                                        }
                                                    />

                                                </label>


                                                <label>

                                                    Image


                                                    <div className="tree-editor-image-picker">

                                                        <input
                                                            type="text"
                                                            value={
                                                                vehicle.image ||
                                                                ""
                                                            }
                                                            readOnly
                                                            placeholder="No image selected"
                                                        />


                                                        <button
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
                                                                selectGroupVehicleImage(
                                                                    vehicleIndex,
                                                                    event
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                </label>


                                                <label>

                                                    Description

                                                    <textarea
                                                        value={
                                                            vehicle.description ||
                                                            ""
                                                        }
                                                        onChange={(event) =>
                                                            updateGroupVehicle(
                                                                vehicleIndex,
                                                                "description",
                                                                event.target.value
                                                            )
                                                        }
                                                    />

                                                </label>

                                            </div>


                                            <button
                                                type="button"
                                                className="danger-button"
                                                onClick={() =>
                                                    removeGroupVehicle(
                                                        vehicleIndex
                                                    )
                                                }
                                            >
                                                Remove
                                            </button>

                                        </div>
                                    )
                                )}

                            </section>


                            <footer className="tree-editor-modal-footer">

                                <button
                                    type="button"
                                    onClick={
                                        closeEditor
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={
                                        saveGroup
                                    }
                                >
                                    Save Group
                                </button>

                            </footer>

                        </div>

                    </div>
                )}

        </div>
    );
}