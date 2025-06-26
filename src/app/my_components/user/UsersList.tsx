// app/my_components/user/UsersList.tsx
'use client';
import {AlertTriangle, Edit, Loader2, Search, Trash2, UserCog, UserPlus, Users as UsersIcon} from "lucide-react"; // Added icons
import React, {useCallback, useEffect, useState} from "react";
import {CreateUserModal} from "./CreateUserModal"; // Assuming correct path
import {fetchUsers as fetchUsersAction} from "@/api/inventory"; // Renamed import to avoid conflict, assuming API call
import {User} from "@/app/types";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Badge} from "@/components/ui/badge";

export const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | undefined>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");


    const loadUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchUsersAction(); // Use renamed action
            if (response && response.data) { // Check response structure
                setUsers(response.data);
            } else {
                setUsers([]);
                setError(response.error.message || "Failed to fetch users: No data returned.");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("An unexpected error occurred while fetching users.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleOpenCreateModal = () => {
        setSelectedUser(undefined);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(undefined);
        loadUsers(); // Re-fetch users after modal closes, in case of create/update
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // TODO: Implement delete user functionality
    const handleDeleteUser = async (userId: number | undefined) => {
        if (!userId) return;
        alert(`TODO: Implement delete for user ID: ${userId}`);
        // Example:
        // await deleteUserAction(userId);
        // loadUsers(); // Refresh
    };


    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <CardTitle className="text-2xl flex items-center gap-2">
                            <UsersIcon className="h-6 w-6 text-primary"/>
                            User Management
                        </CardTitle>
                        <CardDescription>View, add, and manage system users and their roles.</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search
                                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input
                                type="search"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 w-full"
                            />
                        </div>
                        <Button onClick={handleOpenCreateModal}>
                            <UserPlus className="mr-2 h-4 w-4"/> Add User
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {isModalOpen && (
                    <CreateUserModal
                        user={selectedUser}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        // isEdit={isEditMode} // Pass this if your modal supports edit mode
                    />
                )}
                {isLoading ? (
                    <div className="flex items-center justify-center h-60">
                        <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                        <span className="ml-2 text-muted-foreground">Loading users...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-destructive">
                        <AlertTriangle className="mx-auto h-10 w-10 mb-2"/>
                        Error loading users: {error}
                    </div>
                ) : (
                    <Table>
                        {filteredUsers.length === 0 && (
                            <TableCaption className="py-10">
                                <div className="flex flex-col items-center justify-center gap-2">
                                    <UserCog className="h-12 w-12 text-muted-foreground/70"/>
                                    <p className="text-lg font-medium text-muted-foreground">
                                        {searchTerm ? "No users match your search." : "No users found."}
                                    </p>
                                    {!searchTerm &&
                                        <p className="text-sm text-muted-foreground">{"Click Add User to get started."}</p>}
                                </div>
                            </TableCaption>
                        )}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[250px]">Full Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Roles</TableHead>
                                <TableHead className="text-right w-[120px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.fullName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles && user.roles.length > 0
                                                ? user.roles.map(role => (
                                                    <Badge key={role.id || role.userRole} variant="secondary">
                                                        {role.userRole.replace("ROLE_", "")}
                                                    </Badge>
                                                ))
                                                : <Badge variant="outline">No Roles</Badge>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex gap-1 justify-end">
                                            <Button variant="ghost" size="icon"
                                                    onClick={() => handleOpenEditModal(user)} title="Edit User">
                                                <Edit className="h-4 w-4"/> {/* Changed from UserPen for consistency */}
                                            </Button>
                                            <Button variant="ghost" size="icon"
                                                    onClick={() => handleDeleteUser(user.id)} title="Delete User"
                                                    className="text-destructive hover:text-destructive/80">
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
};