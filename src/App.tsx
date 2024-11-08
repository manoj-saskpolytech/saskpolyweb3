// src/App.tsx
import React, { useContext, useEffect, useState } from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import "./index.css"
import Loader from "./scenes/Loader/Index"
import Banner from "./scenes/Banner/index"
import DynamicTitleAndFavicon from "./scenes/DocumentTileName/index"
import { DocumentService } from "./services/Business/DocumentService"
import { lazy, Suspense } from "react"
import { DataContext } from "./context/DataContext"
import ProtectedRoute from "./Authentication/AuthenticationHandler"
import PublicRoute from "./Authentication/PublicRoute"

const HomePage = lazy(() => import("./scenes/Home/index"))
const SignUpComponent = lazy(() => import("./scenes/LandingPage/SignUp"))
const LoginComponent = lazy(() => import("./scenes/LandingPage/Login"))

// Use React.memo to avoid unnecessary re-renders if props do not change
const MemoizedBanner = React.memo(Banner)
const MemoizedDynamicTitleAndFavicon = React.memo(DynamicTitleAndFavicon)

const ProjectRouter: React.FC = () => (
    <main className="content-container" style={{ padding: 0, width: "100%" }}>
        <Suspense fallback={<Loader height="100vh" />}>
            <MemoizedDynamicTitleAndFavicon />
            <Routes>
                <Route
                    path="/SignIn"
                    element={
                        <PublicRoute redirectTo="/Home">
                            <LoginComponent />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/SignUp"
                    element={
                        <PublicRoute redirectTo="/Home">
                            <SignUpComponent />
                        </PublicRoute>
                    }
                />
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/Home" element={<HomePage />} />
                    <Route index element={<Navigate to="/Home" />} />
                </Route>
                <Route path="*" element={<Navigate to="/SignIn" />} />
            </Routes>
        </Suspense>
    </main>
)

const ParentComponent = () => {
    const { dataStore } = useContext(DataContext)

    // Initialize KeyVal with the current value of dataStore.Language
    const [KeyVal, SetKeyVal] = useState(dataStore.Language || "")

    useEffect(() => {
        const loadData = async () => {
            // Load the localization configuration
            await DocumentService.getInstance().ApiService.loadlocalizeConfig()

            // Update KeyVal only if dataStore.Language has changed
            if (dataStore.Language !== KeyVal) {
                SetKeyVal(dataStore.Language)
            }
        }

        // Only run loadData if KeyVal does not match dataStore.Language
        if (dataStore.Language !== KeyVal) {
            loadData()
        }
    }, [dataStore.Language, KeyVal])

    return (
        <React.Fragment key={KeyVal}>
            <MemoizedBanner />
            <div className="app">
                <main className="content">
                    <ProjectRouter />
                </main>
            </div>
        </React.Fragment>
    )
}

export default ParentComponent
