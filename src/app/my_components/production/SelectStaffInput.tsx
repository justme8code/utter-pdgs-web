import {fetchStaffs} from "@/api/staff";
import React, {useEffect, useState} from "react";
import {Staff} from "@/app/types";


export const SelectStaffInput = () => {
    const [staffs, setStaffs] = useState<Staff[]>([]);
    const [selectedStaff, setSelectedStaff] = useState<string>(""); // Track selected staff
    const [error, setError] = useState({state: false, message: ""});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getStaffs = async () => {
            setLoading(true);
            const response = await fetchStaffs();

            if (response.error?.state) {
                setError(response.error);
                setStaffs([]);
            } else {
                setError({state: false, message: ""});
                setStaffs(response.data);
            }

            setLoading(false);
        };

        getStaffs();
    }, []);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStaff(event.target.value);
    };

    return (
        <div>
            {loading ? (
                <p>Loading staff...</p>
            ) : error.state ? (
                <p className="text-red-500">{error.message}</p>
            ) : (
                <select
                    value={selectedStaff}
                    onChange={handleChange}
                    className="p-2 border rounded-md"
                >
                    <option value="">Select a staff member</option>
                    {staffs.map((staff) => (
                        <option key={staff.id} value={staff.userId}>
                            {staff.userFullName} - {staff.companyRole}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};
