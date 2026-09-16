import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { loadTree } from "../../data/treeRegistry";

import TechTreeRank from "./TechTreeRank";

export default function TechTreeRenderer() {

    const { treeSlug } = useParams();

    const [tree, setTree] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        let cancelled = false;

        async function load() {

            setLoading(true);

            const loadedTree =
                await loadTree(treeSlug);

            if (!cancelled) {
                setTree(loadedTree);
                setLoading(false);
            }
        }

        load();

        return () => {
            cancelled = true;
        };

    }, [treeSlug]);


    if (loading) {
        return (
            <div className="tech-tree-loading">
                Loading tech tree...
            </div>
        );
    }


    if (!tree) {
        return (
            <div className="tech-tree missing-tree">

                <h2>
                    Tech tree not found
                </h2>

                <p>
                    No tech tree exists for:
                    {" "}
                    {treeSlug}
                </p>

            </div>
        );
    }


    return (
        <div className="tech-tree">

            <header className="tech-tree-header">

                <h1>
                    {tree.title}
                </h1>

                {tree.description && (
                    <p>
                        {tree.description}
                    </p>
                )}

            </header>

            <div className="tech-tree-ranks">

                {tree.ranks?.map(
                    (rank, index) => (

                        <TechTreeRank
                            key={
                                rank.id ||
                                `${rank.rank}-${index}`
                            }
                            rank={rank}
                        />

                    )
                )}

            </div>

        </div>
    );
}