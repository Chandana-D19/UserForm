
// import { connectToDatabase } from '@/lib/mongodb';
// import mongoose from 'mongoose';

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });

// const User = mongoose.models.User || mongoose.model('User', UserSchema);

// export async function GET() {
//   await connectToDatabase();
//   const users = await User.find();
//   return new Response(JSON.stringify(users), {
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// export async function POST(request) {
//   const data = await request.json();
//   await connectToDatabase();
//   const newUser = await User.create(data);
//   return new Response(JSON.stringify(newUser), {
//     status: 201,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// export async function PUT(request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get('id');
//   const data = await request.json();

//   if (!id) {
//     return new Response(JSON.stringify({ message: 'User ID required' }), {
//       status: 400,
//     });
//   }

//   await connectToDatabase();
//   const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

//   if (!updatedUser) {
//     return new Response(JSON.stringify({ message: 'User not found' }), {
//       status: 404,
//     });
//   }

//   return new Response(JSON.stringify(updatedUser), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

// export async function DELETE(request) {
//   const { id } = await request.json();

//   await connectToDatabase();
//   const deletedUser = await User.findByIdAndDelete(id);

//   return new Response(JSON.stringify(deletedUser), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' },
//   });
// }

import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  await connectDB();
  const users = await User.find().sort({ createdAt: -1 });
  return NextResponse.json(users);
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, email } = await req.json();

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const newUser = await User.create({ name, email });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating user' }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { name, email } = await req.json();
    const id = new URL(req.url).searchParams.get('id');

    // Check if email exists in another user
    const existing = await User.findOne({ email, _id: { $ne: id } });
    if (existing) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    return NextResponse.json(updatedUser);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
  }
}
