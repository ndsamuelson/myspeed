import './App.sass';
import Home from "./pages/Home";
import HeaderComponent from "./common/components/Header";
import {SpeedtestProvider} from "./common/contexts/Speedtests";
import {ConfigProvider} from "./common/contexts/Config";
import {StatusProvider} from "./common/contexts/Status";
import {InputDialogProvider} from "@/common/contexts/InputDialog/InputDialog";
import {useContext, useState} from "react";
import i18n from './i18n';
import Loading from "@/pages/Loading";
import "@/common/styles/spinner.sass";
import Error from "@/pages/Error";
import {ViewContext, ViewProvider} from "@/common/contexts/View";
import Statistics from "@/pages/Statistics";
import {t} from "i18next";
import {ToastNotificationProvider} from "@/common/contexts/ToastNotification";
import Nodes from "@/pages/Nodes";
import {NodeProvider} from "@/common/contexts/Node";

const MainContent = () => {
    const [view] = useContext(ViewContext);
    return (
        <main>
            {view === 0 && <Home/>}
            {view === 1 && <Statistics/>}
            {view !== 0 && view !== 1 && <Error text={t("errors.invalid_view")} disableReload={true}/>}
        </main>
    );
}

const App = () => {
    const [translationsLoaded, setTranslationsLoaded] = useState(false);
    const [translationError, setTranslationError] = useState(false);

    const [showNodePage, setShowNodePage] = useState(false);

    i18n.on("initialized", () => setTranslationsLoaded(true));
    i18n.on("failedLoading", () => setTranslationError(true));

    return (
        <>
            <InputDialogProvider>
                <ToastNotificationProvider>
                    <NodeProvider>
                        {!translationsLoaded && !translationError && <Loading/>}
                        {translationError && <Error text="Failed to load translations"/>}
                        {translationsLoaded && !translationError && showNodePage &&
                            <Nodes setShowNodePage={setShowNodePage}/>}
                        {translationsLoaded && !translationError && !showNodePage && <SpeedtestProvider>
                            <ViewProvider>
                                <ConfigProvider showNodePage={setShowNodePage}>
                                    <StatusProvider>
                                        <HeaderComponent showNodePage={setShowNodePage}/>
                                        <MainContent/>
                                    </StatusProvider>
                                </ConfigProvider>
                            </ViewProvider>
                        </SpeedtestProvider>}
                    </NodeProvider>
                </ToastNotificationProvider>
            </InputDialogProvider>
        </>
    );
}

export default App;
