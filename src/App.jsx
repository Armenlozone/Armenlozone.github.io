import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import CursorDot from "./components/CursorDot/CursorDot";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import TechTrees from "./pages/TechTrees/TechTrees";
import TechTreeRenderer from "./pages/TechTrees/TechTreeRenderer";
import Articles from "./pages/Articles/Articles";
import Projects from "./pages/Projects/Projects";
import ArticleRenderer from "./pages/Articles/ArticleRenderer";
import ArticleEditor from "./pages/Editors/ArticleEditor/ArticleEditor"
import TechTreeEditor from "./pages/Editors/TechTreeEditor/TechTreeEditor"
import "./App.css";

function App() {
    return (
        <>
            <Navbar />
            <CursorDot />

            <main className="page-content">

                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/editors/techtree"
                        element={<TechTreeEditor />}
                    />

                    <Route
                        path="/techtrees"
                        element={<TechTrees />}
                    >
                        <Route
                            path=":treeSlug"
                            element={<TechTreeRenderer />}
                        />
                    </Route>

                    <Route
                        path="/articles"
                        element={<Articles />}
                    >
                        <Route
                            path=":articleSlug"
                            element={<ArticleRenderer />}
                        />
                    </Route>

                    <Route
                        path="/projects"
                        element={<Projects />}
                    />

                    <Route
                        path="/editors/article"
                        element={<ArticleEditor />}
                    />

                    <Route
                        path="/about"
                        element={<About />}
                    />

                </Routes>

            </main>
        </>
    );
}

export default App;