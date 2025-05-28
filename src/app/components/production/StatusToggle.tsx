import React, {useEffect, useState} from "react";
import {Button} from "@/app/components/Button";
import {CheckCheck, Clock2, OctagonPause} from "lucide-react";

type Status = "RUNNING" | "COMPLETED" | "PAUSED";

interface StatusToggleProps {
    onStatusChange?: (newStatus: Status) => void;
    initialStatus?: Status; // Added prop for initial state
}

const states: Status[] = ["RUNNING", "COMPLETED", "PAUSED"];

const StatusToggle: React.FC<StatusToggleProps> = ({ onStatusChange, initialStatus = "RUNNING" }) => {
    const initialIndex = states.indexOf(initialStatus); // Find the index based on the initial status
    const [statusIndex, setStatusIndex] = useState<number>(initialIndex);

    const nextState = (): void => {
        const newIndex = (statusIndex + 1) % states.length;
        setStatusIndex(newIndex);
        onStatusChange?.(states[newIndex]);
    };

    const IconStyles = {
        RUNNING: <Clock2 className={"text-green-500"} />,
        COMPLETED: <CheckCheck className={"text-blue-500"} />,
        PAUSED: <OctagonPause className={"text-yellow-500"} />,
    };

    const currentStatus = states[statusIndex];

    useEffect(() => {
        onStatusChange?.(currentStatus);
    }, [currentStatus, onStatusChange]);

    return (
        <div title={"Update production state"}>
            <Button
                variant={"none"}
                onClick={nextState}
                label={currentStatus.toLowerCase()}
                className={`text-black bg-none ring-1 ring-gray-200 cursor-pointer`}
                icon={IconStyles[currentStatus]}
            />
        </div>
    );
};

export default StatusToggle;
