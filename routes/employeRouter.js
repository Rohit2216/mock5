
const express = require("express");
const employeeRouter = express.Router();
const {Employee} = require("../models/employemodel");

employeeRouter.post('/employees', async (req, res) => {
    try {
      const employeeData = req.body;
      const employee = await Employee.create(employeeData);

      res.json(employee);
    } catch (error) {
     
      res.status(500).json({ error: 'Failed to add employee' });
    }
  });
  

  employeeRouter.put('/employees/:id', async (req, res) => {
    try {
      const employeeId = req.params.id;
      const updatedEmployeeData = req.body;
  
     
      const updatedEmployee = await Employee.findByIdAndUpdate(
        employeeId,
        updatedEmployeeData,
        { new: true }
      );
  
      
      res.json(updatedEmployee);
    } catch (error) {
      
      res.status(500).json({ error: 'Failed to update employee' });
    }
  });
  

  employeeRouter.delete('/employees/:id', async (req, res) => {
    try {
      const employeeId = req.params.id;
  
     
      await Employee.findByIdAndRemove(employeeId);
  
      
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
     
      res.status(500).json({ error: 'Failed to delete employee' });
    }
  });

  
  employeeRouter.get('/employees', async (req, res) => {
    try {
      const { page, limit, department, search, sort } = req.query;
      const query = {};
  
      if (department) {
        query.department = department;
      }    
      if (search) {
        query.firstName = { $regex: search, $options: 'i' };
      }
  
      
      const totalCount = await Employee.countDocuments(query);
      const sortOptions = sort ? { salary: sort === 'asc' ? 1 : -1 } : {};

      const employees = await Employee.find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(Number(limit));
    
      res.json({
        totalCount,
        employees,
      });
    } catch (error) {
      
      res.status(500).json({ error: 'Failed to retrieve employees' });
    }
  });

module.exports = {
    employeeRouter
};