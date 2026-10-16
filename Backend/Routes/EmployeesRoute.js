import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import Employee from "../Models/EmployeeDB.js";

// GET /employees - It will Fetch all employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /employees - Add a new employee
router.post("/", async (req, res) => {
    console.log("POST employee route hit");
    console.log("Request data:", req.body);
    try {
        const { name, email, role } = req.body;

        if (!name?.trim() || !email?.trim() || !role?.trim()) {
            return res.status(400).json({
                message: "Name, email and role are required"
            });
        }

        const employee = await Employee.create({ name, email, role });

        res.status(201).json({
            message: "Employee added successfully",
            data: employee
        });
    } catch (error) {
        console.log("Error code:", error.code);
        console.log("Duplicate field:", error.keyPattern);
        console.log("Duplicate value:", error.keyValue);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

// PUT /employees/:id - Update an employee
router.put("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const { name, email, role } = req.body;

        if (!name?.trim() || !email?.trim() || !role?.trim()) {
            return res.status(400).json({
                message: "Name, email and role are required"
            });
        }

        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            { name, email, role },
            { new: true, runValidators: true }
        );

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({
            message: "Employee updated successfully",
            data: employee
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email already exists" });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
});

// DELETE /employees/:id - Delete an employee
router.delete("/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: "Invalid employee ID" });
        }

        const employee = await Employee.findByIdAndDelete(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.status(200).json({
            message: "Employee deleted successfully",
            data: employee
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;