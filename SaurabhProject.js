// Import necessary packages
const express = require('express');
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');


// Initialize express app
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://spandey6395:R43s8If0R4EpfraA@cluster0.mknlo.mongodb.net/Saurabh56790', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema for MongoDB collection
const EmployeeeSchema = new mongoose.Schema({
    EmployeeID: String,
    FullName: String,
    JobTitle: String,
    Department: String,
    BusinessUnit: String,
    Gender: String,
    Ethnicity: String,
    Age: String,
    HireDate:String,
    AnnualSalary: String,
    Bonous: String,
    Country: String,
    City: String,
    ExitDate: String,
});

// Define model for MongoDB collection
const MyModel = mongoose.model('EmployeeeSchema', EmployeeeSchema);

// Define route to read CSV file and save data in MongoDB
app.get('/saveData', (req, res) => {
  fs.createReadStream('Employee Sample Data.csv')
    .pipe(csv())
    .on('data', (data) => {
      // Create new document for each row in CSV file
      const myData = new MyModel({
        EmployeeID: data.EmployeeID,
        FullName: data.FullName,
        JobTitle: data.JobTitle,
        Department: data.Department,
        BusinessUnit: data.BusinessUnit,
        Gender: data.Gender,
        Ethnicity: data.Ethnicity,
        Age: data.Age,
        HireDate: data.HireDate,
        AnnualSalary: data.AnnualSalary,
        Bonous: data.Bonus,
        Country: data.Country,
        City: data.City,
        ExitDate: data.ExitDate,
      });

      // Save document to MongoDB
      myData.save()
        .then(() => {
          console.log('Data saved successfully');
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .on('end', () => {
      res.send('Data saved successfully');
    });
});

// Define route to get employee data from MongoDB
app.get('/getEmployeeData', (req, res) => {
  const EmployeeId = req.query.EmployeeId || '';
  const jobTitleParam = req.query.job_title || '';
  const departmentParam = req.query.department || '';
  const genderParam = req.query.gender || '';
  const countryParam = req.query.Country || '';
  const cityParam = req.query.City || '';
  const fromHireDateParam = req.query.from_hiring_date || '';
  const toHireDateParam = req.query.to_hiring_date || '';
  const sortByParam = req.query.sort_by || '';
  const filter = {
    EmployeeID: { $regex: EmployeeId, $options: 'i' },
    JobTitle: { $regex: jobTitleParam, $options: 'i' },
    Department: { $regex: departmentParam, $options: 'i' },
    Gender: { $regex: genderParam, $options: 'i' },
    Country: { $regex: countryParam, $options: 'i' },
    City: { $regex: cityParam, $options: 'i' },
  };

  if (fromHireDateParam && toHireDateParam) {
    filter.HireDate = { $gte: fromHireDateParam, $lte: toHireDateParam };
  } else if (fromHireDateParam) {
    filter.HireDate = { $gte: fromHireDateParam };
  } else if (toHireDateParam) {
    filter.HireDate = { $lte: toHireDateParam };
  }


  MyModel.find(filter).sort({HireDate:1})
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error getting employee data');
    });
});


// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
