import {Button} from "@/app/my_components/Button";
import {CheckCheck, Clock2, OctagonPause} from "lucide-react";

type Status = "RUNNING" | "COMPLETED" | "STOPPED" | "PAUSED";

interface CurrentStatusProps {
    initialStatus?: Status; // Added prop for initial state
}

const CurrentStatus: React.FC<CurrentStatusProps> = ({initialStatus = "RUNNING" }) => {
    const IconStyles = {
        RUNNING: <Clock2 className={"text-green-500"} />,
        COMPLETED: <CheckCheck className={"text-blue-500"} />,
        PAUSED: <OctagonPause className={"text-yellow-500"} />,
        STOPPED: <OctagonPause className={"text-red-500"} />,
    };

    return (
        <div title={"Update production state"}>
            <Button
                variant={"none"}
                label={initialStatus.toLowerCase()}
                className={`text-black bg-none`}
                icon={IconStyles[initialStatus]}
            />
        </div>
    );
};

export default CurrentStatus;
