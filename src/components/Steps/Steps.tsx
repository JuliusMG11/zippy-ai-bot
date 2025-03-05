import React from 'react';

import './steps.css';

const Steps = () => {

    return (    
        <div className="flex gap-4 items-start py-8">
            <div className="step flex flex-col items-center text-center">
                <div className="step__number">
                    1
                </div>
                Generate your prompt
            </div>

            <div className="step flex flex-col items-center text-center">
                <div className="step__number">
                    2
                </div>
                Select your profile
            </div>

            <div className="step flex flex-col items-center text-center">
                <div className="step__number">
                    3
                </div>
                Select automatic schedule like 1 hour or 2
            </div>
            <div className="step flex flex-col items-center text-center">
                <div className="step__number">
                    4
                </div>
                Click on the schedule btn.
            </div>
        </div>
    )
};  

export default Steps;      