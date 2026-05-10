import React from 'react';
import { GapAnalysisProvider, useGapAnalysisContext } from '../../features/gap-analysis/context/gap-analysis.context';
import { InputView } from '../../features/gap-analysis/components/InputView/InputView';
import { OutputView } from '../../features/gap-analysis/components/OutputView/OutputView';
import { AnalyzingScreen } from '../../features/gap-analysis/components/AnalyzingScreen';
import '../../features/gap-analysis/gap-analysis.scss';

const GapAnalysisContent = () => {
    const { view } = useGapAnalysisContext();

    return (
        <div className="gap-analysis-container">
            {view === 'input' && <InputView />}
            {view === 'analyzing' && <AnalyzingScreen />}
            {view === 'output' && <OutputView />}
        </div>
    );
};

const GapAnalysis = () => (
    <GapAnalysisProvider>
        <GapAnalysisContent />
    </GapAnalysisProvider>
);

export default GapAnalysis;
