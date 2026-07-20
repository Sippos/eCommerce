import brcypt from 'bcrypt'
import type { NextFunction, Request, Response } from "express"

import { User } from "../models/index.ts"

const SALT_ROUNDS = 10

export async function createUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { name, email, password } = request.body;

    const existingUser = await User.findOne({ email })

    if (existingUser) {
        response.status(409).json({
            error: "A user with this email already exists"
        });
        return
    }

    const hashedPassword = await brcypt.hash(
        password,
        SALT_ROUNDS,
    )

    const user = await User.create({
        name, 
        email,
        password: hashedPassword,
    })

    response.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    })
  } catch (error) {
    next(error)
  }
}

export async function getUsers(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const users = await User.find().select("-password");

    response.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      response.status(404).json({
        error: "User not found",
      });
      return;
    }

    response.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;
    const { name, email, password } = request.body;

    const user = await User.findById(id);

    if (!user) {
      response.status(404).json({
        error: "User not found",
      });
      return;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        response.status(409).json({
          error: "A user with this email already exists",
        });
        return;
      }

      user.email = email;
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (password !== undefined) {
      user.password = await brcypt.hash(
        password,
        SALT_ROUNDS,
      );
    }

    await user.save();

    response.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = request.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      response.status(404).json({
        error: "User not found",
      });
      return;
    }

    response.status(204).send();
  } catch (error) {
    next(error);
  }
}