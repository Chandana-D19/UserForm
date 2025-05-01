'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';

export default function HomePage() {
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      if (res.ok) {
        const usersData = await res.json();
        setUsers(usersData);
      } else {
        setMessage('❌ Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingUserId ? 'PUT' : 'POST';
    const url = editingUserId ? `/api/users?id=${editingUserId}` : '/api/users';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.status === 409) {
      setMessage('❌ Email already exists');
      return;
    }

    if (res.ok) {
      const userData = await res.json();

      if (editingUserId) {
        // Update user in UI
        setUsers((prev) =>
          prev.map((user) => (user._id === userData._id ? userData : user))
        );
        setMessage('✅ User updated!');
      } else {
        setUsers((prev) => [...prev, userData]);
        setMessage('✅ User created!');
      }

      setForm({ name: '', email: '' });
      setEditingUserId(null);
    } else {
      setMessage('❌ Error saving user');
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingUserId(user._id);
    setMessage('');
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setUsers(users.filter((user) => user._id !== id));
      setMessage('✅ User deleted!');
    } else {
      setMessage('❌ Error deleting user');
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{editingUserId ? 'Edit User' : 'Create a User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              {editingUserId ? 'Update User' : 'Create User'}
            </Button>
            {message && <p className="text-sm text-green-600">{message}</p>}
          </form>
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-6">
            Show Users
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User List</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    No users yet.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="flex space-x-2">
                      <Button onClick={() => handleEdit(user)}>Edit</Button>
                      <Button onClick={() => handleDelete(user._id)} variant="destructive">
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </main>
  );
}



// 'use client';

// import { useState, useEffect } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Table,
//   TableHeader,
//   TableRow,
//   TableHead,
//   TableBody,
//   TableCell,
// } from '@/components/ui/table';

// export default function HomePage() {
//   const [form, setForm] = useState({ name: '', email: '' });
//   const [message, setMessage] = useState('');
//   const [users, setUsers] = useState([]);
//   const [editingUserId, setEditingUserId] = useState(null);

//   // Fetch users when the component mounts
//   useEffect(() => {
//     const fetchUsers = async () => {
//       const res = await fetch('/api/users');
//       if (res.ok) {
//         const usersData = await res.json();
//         setUsers(usersData);
//       } else {
//         setMessage('❌ Error fetching users');
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const method = editingUserId ? 'PUT' : 'POST';
//     const url = editingUserId ? `/api/users?id=${editingUserId}` : '/api/users';

//     const res = await fetch(url, {
//       method,
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });

//     if (res.ok) {
//       const updatedUser = await res.json();
//       if (editingUserId) {
//         // Update the user in the list after editing
//         setUsers((prevUsers) =>
//           prevUsers.map((user) =>
//             user._id === updatedUser._id ? updatedUser : user
//           )
//         );
//         setMessage('✅ User updated!');
//       } else {
//         setUsers((prevUsers) => [...prevUsers, updatedUser]);
//         setMessage('✅ User created!');
//       }
//       setForm({ name: '', email: '' });
//       setEditingUserId(null); // Reset editing mode
//     } else {
//       setMessage('❌ Error saving user');
//     }
//   };

//   const handleEdit = (user) => {
//     setForm({ name: user.name, email: user.email });
//     setEditingUserId(user._id); // Set user ID for editing
//   };

//   const handleDelete = async (id) => {
//     const res = await fetch('/api/users', {
//       method: 'DELETE',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ id }),
//     });

//     if (res.ok) {
//       setUsers(users.filter((user) => user._id !== id));
//       setMessage('✅ User deleted!');
//     } else {
//       setMessage('❌ Error deleting user');
//     }
//   };

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>{editingUserId ? 'Edit User' : 'Create a User'}</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name</Label>
//               <Input
//                 id="name"
//                 name="name"
//                 placeholder="Enter your name"
//                 value={form.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="email">Email</Label>
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={form.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             <Button type="submit" className="w-full">
//               {editingUserId ? 'Update User' : 'Create User'}
//             </Button>
//             {message && <p className="text-sm text-green-600">{message}</p>}
//           </form>
//         </CardContent>
//       </Card>

//       {/* Dialog Example */}
//       <Dialog>
//         <DialogTrigger asChild>
//           <Button variant="outline" className="mt-6">
//             Show Users
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>User List</DialogTitle>
//           </DialogHeader>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan="3" className="text-center">
//                     No users yet.
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 users.map((user) => (
//                   <TableRow key={user._id}>
//                     <TableCell>{user.name}</TableCell>
//                     <TableCell>{user.email}</TableCell>
//                     <TableCell className="flex space-x-2">
//                       <Button onClick={() => handleEdit(user)}>Edit</Button>
//                       <Button onClick={() => handleDelete(user._id)} variant="destructive">
//                         Delete
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </DialogContent>
//       </Dialog>
//     </main>
//   );
// }





