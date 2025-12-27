const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const connectDB = require('../config/database');

const MaintenanceStage = require('../models/MaintenanceStage');
const Department = require('../models/Department');
const EquipmentCategory = require('../models/EquipmentCategory');
const User = require('../models/User');
const Employee = require('../models/Employee');
const MaintenanceTeam = require('../models/MaintenanceTeam');
const Equipment = require('../models/Equipment');
const MaintenanceRequest = require('../models/MaintenanceRequest');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await MaintenanceRequest.deleteMany({});
    await Equipment.deleteMany({});
    await MaintenanceTeam.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
    await MaintenanceStage.deleteMany({});
    await Department.deleteMany({});
    await EquipmentCategory.deleteMany({});
    console.log('✓ Cleared all existing data\n');

    // 1. Seed Maintenance Stages
    console.log('Seeding maintenance stages...');
    const stages = await MaintenanceStage.insertMany([
      { name: 'New', sequence: 10, fold: false, isDone: false, isScrap: false },
      { name: 'In Progress', sequence: 20, fold: false, isDone: false, isScrap: false },
      { name: 'Repaired', sequence: 30, fold: true, isDone: true, isScrap: false },
      { name: 'Scrap', sequence: 40, fold: true, isDone: false, isScrap: true }
    ]);
    const newStage = stages.find(s => s.name === 'New');
    const inProgressStage = stages.find(s => s.name === 'In Progress');
    const repairedStage = stages.find(s => s.name === 'Repaired');
    const scrapStage = stages.find(s => s.name === 'Scrap');
    console.log(`✓ Seeded ${stages.length} maintenance stages\n`);

    // 2. Seed Departments
    console.log('Seeding departments...');
    const departments = await Department.insertMany([
      { name: 'Production' },
      { name: 'IT' },
      { name: 'Maintenance' },
      { name: 'Quality Control' },
      { name: 'Logistics' },
      { name: 'Administration' },
      { name: 'Engineering' },
      { name: 'Safety & Compliance' }
    ]);
    const productionDept = departments.find(d => d.name === 'Production');
    const itDept = departments.find(d => d.name === 'IT');
    const maintenanceDept = departments.find(d => d.name === 'Maintenance');
    const qcDept = departments.find(d => d.name === 'Quality Control');
    const logisticsDept = departments.find(d => d.name === 'Logistics');
    const adminDept = departments.find(d => d.name === 'Administration');
    const engineeringDept = departments.find(d => d.name === 'Engineering');
    console.log(`✓ Seeded ${departments.length} departments\n`);

    // 3. Seed Equipment Categories
    console.log('Seeding equipment categories...');
    const categories = await EquipmentCategory.insertMany([
      { name: 'Machinery', active: true },
      { name: 'Computers', active: true },
      { name: 'Vehicles', active: true },
      { name: 'Tools', active: true },
      { name: 'Office Equipment', active: true },
      { name: 'HVAC', active: true },
      { name: 'Electronics', active: true },
      { name: 'Safety Equipment', active: true }
    ]);
    const machineryCat = categories.find(c => c.name === 'Machinery');
    const computersCat = categories.find(c => c.name === 'Computers');
    const vehiclesCat = categories.find(c => c.name === 'Vehicles');
    const toolsCat = categories.find(c => c.name === 'Tools');
    const officeCat = categories.find(c => c.name === 'Office Equipment');
    const hvacCat = categories.find(c => c.name === 'HVAC');
    const electronicsCat = categories.find(c => c.name === 'Electronics');
    console.log(`✓ Seeded ${categories.length} equipment categories\n`);

    // 4. Seed Users (Multiple roles)
    console.log('Seeding users...');
    // Hash passwords before creating users (insertMany bypasses pre-save hooks)
    const salt = await bcrypt.genSalt(10);
    const hashPassword = async (password) => await bcrypt.hash(password, salt);
    
    const userData = [
      // Admins
      { name: 'Admin User', email: 'admin@gearguard.com', password: await hashPassword('admin123'), role: 'admin' },
      { name: 'Sarah Johnson', email: 'sarah.johnson@gearguard.com', password: await hashPassword('password123'), role: 'admin' },
      
      // Managers
      { name: 'Michael Chen', email: 'michael.chen@gearguard.com', password: await hashPassword('password123'), role: 'manager' },
      { name: 'Emily Rodriguez', email: 'emily.rodriguez@gearguard.com', password: await hashPassword('password123'), role: 'manager' },
      { name: 'David Kim', email: 'david.kim@gearguard.com', password: await hashPassword('password123'), role: 'manager' },
      
      // Technicians
      { name: 'John Smith', email: 'john.smith@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'Robert Wilson', email: 'robert.wilson@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'James Brown', email: 'james.brown@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'William Davis', email: 'william.davis@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'Richard Miller', email: 'richard.miller@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'Thomas Anderson', email: 'thomas.anderson@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'Christopher Taylor', email: 'christopher.taylor@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      { name: 'Daniel Martinez', email: 'daniel.martinez@gearguard.com', password: await hashPassword('password123'), role: 'technician' },
      
      // Regular Users/Employees
      { name: 'Jennifer Lee', email: 'jennifer.lee@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Lisa Anderson', email: 'lisa.anderson@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Patricia White', email: 'patricia.white@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Linda Harris', email: 'linda.harris@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Barbara Martin', email: 'barbara.martin@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Elizabeth Thompson', email: 'elizabeth.thompson@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Jessica Garcia', email: 'jessica.garcia@gearguard.com', password: await hashPassword('password123'), role: 'user' },
      { name: 'Susan Martinez', email: 'susan.martinez@gearguard.com', password: await hashPassword('password123'), role: 'user' }
    ];
    
    const users = await User.insertMany(userData);
    
    const adminUser = users.find(u => u.email === 'admin@gearguard.com');
    const manager1 = users.find(u => u.email === 'michael.chen@gearguard.com');
    const manager2 = users.find(u => u.email === 'emily.rodriguez@gearguard.com');
    const technicians = users.filter(u => u.role === 'technician');
    const regularUsers = users.filter(u => u.role === 'user');
    
    console.log(`✓ Seeded ${users.length} users (${users.filter(u => u.role === 'admin').length} admins, ${users.filter(u => u.role === 'manager').length} managers, ${technicians.length} technicians, ${regularUsers.length} users)\n`);

    // 5. Seed Employees
    console.log('Seeding employees...');
    const employees = await Employee.insertMany([
      { name: 'Jennifer Lee', department: productionDept._id },
      { name: 'Lisa Anderson', department: productionDept._id },
      { name: 'Patricia White', department: itDept._id },
      { name: 'Linda Harris', department: itDept._id },
      { name: 'Barbara Martin', department: qcDept._id },
      { name: 'Elizabeth Thompson', department: logisticsDept._id },
      { name: 'Jessica Garcia', department: logisticsDept._id },
      { name: 'Susan Martinez', department: adminDept._id }
    ]);
    console.log(`✓ Seeded ${employees.length} employees\n`);

    // 6. Seed Maintenance Teams
    console.log('Seeding maintenance teams...');
    const teams = await MaintenanceTeam.insertMany([
      {
        name: 'Mechanical Team',
        active: true,
        members: [technicians[0]._id, technicians[1]._id, technicians[2]._id],
        createdBy: adminUser._id
      },
      {
        name: 'IT Support Team',
        active: true,
        members: [technicians[3]._id, technicians[4]._id],
        createdBy: adminUser._id
      },
      {
        name: 'Electrical Team',
        active: true,
        members: [technicians[5]._id, technicians[6]._id],
        createdBy: adminUser._id
      },
      {
        name: 'HVAC Team',
        active: true,
        members: [technicians[7]._id],
        createdBy: adminUser._id
      },
      {
        name: 'General Maintenance',
        active: true,
        members: [technicians[0]._id, technicians[1]._id, technicians[5]._id],
        createdBy: adminUser._id
      }
    ]);
    const mechanicalTeam = teams.find(t => t.name === 'Mechanical Team');
    const itTeam = teams.find(t => t.name === 'IT Support Team');
    const electricalTeam = teams.find(t => t.name === 'Electrical Team');
    const hvacTeam = teams.find(t => t.name === 'HVAC Team');
    const generalTeam = teams.find(t => t.name === 'General Maintenance');
    console.log(`✓ Seeded ${teams.length} maintenance teams\n`);

    // 7. Seed Equipment
    console.log('Seeding equipment...');
    const now = new Date();
    const equipment = await Equipment.insertMany([
      // Production Equipment
      {
        name: 'CNC Milling Machine #1',
        serialNumber: 'CNC-001',
        purchaseDate: new Date(2020, 0, 15),
        warrantyStartDate: new Date(2020, 0, 15),
        warrantyEndDate: new Date(2023, 0, 15),
        location: 'Production Floor A',
        departmentId: productionDept._id,
        categoryId: machineryCat._id,
        employeeId: employees[0]._id,
        maintenanceTeamId: mechanicalTeam._id,
        technicianId: technicians[0]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'CNC Milling Machine #2',
        serialNumber: 'CNC-002',
        purchaseDate: new Date(2021, 3, 20),
        warrantyStartDate: new Date(2021, 3, 20),
        warrantyEndDate: new Date(2024, 3, 20),
        location: 'Production Floor A',
        departmentId: productionDept._id,
        categoryId: machineryCat._id,
        employeeId: employees[1]._id,
        maintenanceTeamId: mechanicalTeam._id,
        technicianId: technicians[1]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Lathe Machine #1',
        serialNumber: 'LAT-001',
        purchaseDate: new Date(2019, 5, 10),
        warrantyStartDate: new Date(2019, 5, 10),
        warrantyEndDate: new Date(2022, 5, 10),
        location: 'Production Floor B',
        departmentId: productionDept._id,
        categoryId: machineryCat._id,
        employeeId: employees[0]._id,
        maintenanceTeamId: mechanicalTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Assembly Line Conveyor',
        serialNumber: 'CONV-001',
        purchaseDate: new Date(2022, 1, 5),
        warrantyStartDate: new Date(2022, 1, 5),
        warrantyEndDate: new Date(2025, 1, 5),
        location: 'Production Floor C',
        departmentId: productionDept._id,
        categoryId: machineryCat._id,
        maintenanceTeamId: mechanicalTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      
      // IT Equipment
      {
        name: 'Server Rack #1',
        serialNumber: 'SRV-001',
        purchaseDate: new Date(2021, 8, 1),
        warrantyStartDate: new Date(2021, 8, 1),
        warrantyEndDate: new Date(2024, 8, 1),
        location: 'Server Room',
        departmentId: itDept._id,
        categoryId: computersCat._id,
        employeeId: employees[2]._id,
        maintenanceTeamId: itTeam._id,
        technicianId: technicians[3]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Workstation PC #1',
        serialNumber: 'WS-001',
        purchaseDate: new Date(2023, 2, 15),
        warrantyStartDate: new Date(2023, 2, 15),
        warrantyEndDate: new Date(2026, 2, 15),
        location: 'IT Office',
        departmentId: itDept._id,
        categoryId: computersCat._id,
        employeeId: employees[3]._id,
        maintenanceTeamId: itTeam._id,
        technicianId: technicians[4]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Network Switch #1',
        serialNumber: 'NET-001',
        purchaseDate: new Date(2022, 6, 10),
        warrantyStartDate: new Date(2022, 6, 10),
        warrantyEndDate: new Date(2025, 6, 10),
        location: 'Server Room',
        departmentId: itDept._id,
        categoryId: electronicsCat._id,
        maintenanceTeamId: itTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Laptop #1',
        serialNumber: 'LAP-001',
        purchaseDate: new Date(2023, 4, 20),
        warrantyStartDate: new Date(2023, 4, 20),
        warrantyEndDate: new Date(2026, 4, 20),
        location: 'IT Office',
        departmentId: itDept._id,
        categoryId: computersCat._id,
        employeeId: employees[2]._id,
        maintenanceTeamId: itTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      
      // Vehicles
      {
        name: 'Forklift #1',
        serialNumber: 'FL-001',
        purchaseDate: new Date(2020, 9, 5),
        warrantyStartDate: new Date(2020, 9, 5),
        warrantyEndDate: new Date(2023, 9, 5),
        location: 'Warehouse',
        departmentId: logisticsDept._id,
        categoryId: vehiclesCat._id,
        employeeId: employees[5]._id,
        maintenanceTeamId: mechanicalTeam._id,
        technicianId: technicians[2]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Delivery Van #1',
        serialNumber: 'VAN-001',
        purchaseDate: new Date(2021, 11, 1),
        warrantyStartDate: new Date(2021, 11, 1),
        warrantyEndDate: new Date(2024, 11, 1),
        location: 'Parking Lot',
        departmentId: logisticsDept._id,
        categoryId: vehiclesCat._id,
        employeeId: employees[6]._id,
        maintenanceTeamId: mechanicalTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      
      // HVAC Equipment
      {
        name: 'Central AC Unit #1',
        serialNumber: 'HVAC-001',
        purchaseDate: new Date(2019, 3, 15),
        warrantyStartDate: new Date(2019, 3, 15),
        warrantyEndDate: new Date(2022, 3, 15),
        location: 'Building A - Roof',
        departmentId: maintenanceDept._id,
        categoryId: hvacCat._id,
        maintenanceTeamId: hvacTeam._id,
        technicianId: technicians[7]._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'HVAC Duct System',
        serialNumber: 'HVAC-002',
        purchaseDate: new Date(2020, 7, 20),
        warrantyStartDate: new Date(2020, 7, 20),
        warrantyEndDate: new Date(2023, 7, 20),
        location: 'Building A',
        departmentId: maintenanceDept._id,
        categoryId: hvacCat._id,
        maintenanceTeamId: hvacTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      
      // Office Equipment
      {
        name: 'Printer #1',
        serialNumber: 'PRT-001',
        purchaseDate: new Date(2022, 5, 10),
        warrantyStartDate: new Date(2022, 5, 10),
        warrantyEndDate: new Date(2025, 5, 10),
        location: 'Admin Office',
        departmentId: adminDept._id,
        categoryId: officeCat._id,
        employeeId: employees[7]._id,
        maintenanceTeamId: itTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Photocopier #1',
        serialNumber: 'PHO-001',
        purchaseDate: new Date(2021, 10, 5),
        warrantyStartDate: new Date(2021, 10, 5),
        warrantyEndDate: new Date(2024, 10, 5),
        location: 'Admin Office',
        departmentId: adminDept._id,
        categoryId: officeCat._id,
        maintenanceTeamId: itTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      
      // Tools
      {
        name: 'Power Drill Set',
        serialNumber: 'TOOL-001',
        purchaseDate: new Date(2023, 1, 15),
        warrantyStartDate: new Date(2023, 1, 15),
        warrantyEndDate: new Date(2026, 1, 15),
        location: 'Maintenance Workshop',
        departmentId: maintenanceDept._id,
        categoryId: toolsCat._id,
        maintenanceTeamId: generalTeam._id,
        active: true,
        createdBy: adminUser._id
      },
      {
        name: 'Welding Machine',
        serialNumber: 'TOOL-002',
        purchaseDate: new Date(2020, 4, 20),
        warrantyStartDate: new Date(2020, 4, 20),
        warrantyEndDate: new Date(2023, 4, 20),
        location: 'Maintenance Workshop',
        departmentId: maintenanceDept._id,
        categoryId: toolsCat._id,
        maintenanceTeamId: mechanicalTeam._id,
        technicianId: technicians[0]._id,
        active: true,
        createdBy: adminUser._id
      }
    ]);
    console.log(`✓ Seeded ${equipment.length} equipment items\n`);

    // 8. Seed Maintenance Requests
    console.log('Seeding maintenance requests...');
    const requests = await MaintenanceRequest.insertMany([
      // New Requests
      {
        subject: 'CNC Machine #1 - Abnormal Noise',
        description: 'CNC milling machine producing unusual grinding noise during operation. Needs immediate inspection.',
        equipment: equipment[0]._id,
        category: machineryCat._id,
        maintenanceTeam: mechanicalTeam._id,
        technician: technicians[0]._id,
        user: regularUsers[0]._id,
        stage: newStage._id,
        requestType: 'corrective',
        priority: '2',
        state: 'new',
        scheduledDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        dateRequest: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: regularUsers[0]._id
      },
      {
        subject: 'Server Rack Overheating',
        description: 'Server rack temperature rising above normal levels. Cooling system may need maintenance.',
        equipment: equipment[4]._id,
        category: computersCat._id,
        maintenanceTeam: itTeam._id,
        technician: technicians[3]._id,
        user: regularUsers[2]._id,
        stage: newStage._id,
        requestType: 'corrective',
        priority: '1',
        state: 'new',
        scheduledDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        dateRequest: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        createdBy: regularUsers[2]._id
      },
      {
        subject: 'Forklift Hydraulic Leak',
        description: 'Forklift showing signs of hydraulic fluid leak. Safety inspection required before use.',
        equipment: equipment[8]._id,
        category: vehiclesCat._id,
        maintenanceTeam: mechanicalTeam._id,
        technician: technicians[2]._id,
        user: regularUsers[4]._id,
        stage: newStage._id,
        requestType: 'corrective',
        priority: '2',
        state: 'new',
        scheduledDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        dateRequest: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
        createdBy: regularUsers[4]._id
      },
      
      // In Progress Requests
      {
        subject: 'Printer Paper Jam - Recurring Issue',
        description: 'Printer experiencing frequent paper jams. May need cleaning or part replacement.',
        equipment: equipment[12]._id,
        category: officeCat._id,
        maintenanceTeam: itTeam._id,
        technician: technicians[4]._id,
        user: regularUsers[6]._id,
        stage: inProgressStage._id,
        requestType: 'corrective',
        priority: '3',
        state: 'in_progress',
        scheduledDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        dateRequest: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        dateStart: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: regularUsers[6]._id
      },
      {
        subject: 'AC Unit - Routine Maintenance',
        description: 'Quarterly maintenance check for central AC unit. Filter replacement and system inspection.',
        equipment: equipment[10]._id,
        category: hvacCat._id,
        maintenanceTeam: hvacTeam._id,
        technician: technicians[7]._id,
        user: manager1._id,
        stage: inProgressStage._id,
        requestType: 'preventive',
        priority: '3',
        state: 'in_progress',
        scheduledDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        dateRequest: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dateStart: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdBy: manager1._id
      },
      {
        subject: 'Workstation PC - Software Update',
        description: 'Workstation requires OS and software updates. Backup data before proceeding.',
        equipment: equipment[5]._id,
        category: computersCat._id,
        maintenanceTeam: itTeam._id,
        technician: technicians[4]._id,
        user: regularUsers[3]._id,
        stage: inProgressStage._id,
        requestType: 'preventive',
        priority: '2',
        state: 'in_progress',
        scheduledDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        dateRequest: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dateStart: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: regularUsers[3]._id
      },
      
      // Repaired Requests
      {
        subject: 'Lathe Machine - Belt Replacement',
        description: 'Lathe machine belt worn out and replaced. Machine tested and operational.',
        equipment: equipment[2]._id,
        category: machineryCat._id,
        maintenanceTeam: mechanicalTeam._id,
        technician: technicians[1]._id,
        user: regularUsers[0]._id,
        stage: repairedStage._id,
        requestType: 'corrective',
        priority: '2',
        state: 'repaired',
        scheduledDate: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dateRequest: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        dateStart: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        dateEnd: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        duration: 2 * 24 * 60 * 60 * 1000, // 2 days
        maintenanceCost: 450.00,
        createdBy: regularUsers[0]._id
      },
      {
        subject: 'Network Switch - Port Replacement',
        description: 'Faulty network port replaced. All connections tested and working.',
        equipment: equipment[6]._id,
        category: electronicsCat._id,
        maintenanceTeam: itTeam._id,
        technician: technicians[3]._id,
        user: regularUsers[2]._id,
        stage: repairedStage._id,
        requestType: 'corrective',
        priority: '1',
        state: 'repaired',
        scheduledDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dateRequest: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
        dateStart: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dateEnd: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
        duration: 1 * 24 * 60 * 60 * 1000, // 1 day
        maintenanceCost: 120.00,
        createdBy: regularUsers[2]._id
      },
      {
        subject: 'Delivery Van - Oil Change & Inspection',
        description: 'Routine maintenance completed. Oil changed, fluids checked, tires inspected.',
        equipment: equipment[9]._id,
        category: vehiclesCat._id,
        maintenanceTeam: mechanicalTeam._id,
        technician: technicians[2]._id,
        user: regularUsers[5]._id,
        stage: repairedStage._id,
        requestType: 'preventive',
        priority: '3',
        state: 'repaired',
        scheduledDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dateRequest: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        dateStart: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        dateEnd: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        duration: 1 * 24 * 60 * 60 * 1000, // 1 day
        maintenanceCost: 85.00,
        createdBy: regularUsers[5]._id
      },
      
      // Scrap Requests
      {
        subject: 'Old Photocopier - Beyond Repair',
        description: 'Photocopier has multiple critical failures. Cost of repair exceeds replacement value. Recommended for scrapping.',
        equipment: equipment[13]._id,
        category: officeCat._id,
        maintenanceTeam: itTeam._id,
        technician: technicians[4]._id,
        user: regularUsers[7]._id,
        stage: scrapStage._id,
        requestType: 'corrective',
        priority: '3',
        state: 'scrap',
        scheduledDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dateRequest: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        dateStart: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        dateEnd: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
        duration: 2 * 24 * 60 * 60 * 1000, // 2 days
        maintenanceCost: 0,
        note: 'Equipment scrapped due to uneconomical repair cost',
        createdBy: regularUsers[7]._id
      }
    ]);
    console.log(`✓ Seeded ${requests.length} maintenance requests (${requests.filter(r => r.state === 'new').length} new, ${requests.filter(r => r.state === 'in_progress').length} in progress, ${requests.filter(r => r.state === 'repaired').length} repaired, ${requests.filter(r => r.state === 'scrap').length} scrap)\n`);

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Database seeding completed successfully!');
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 Summary:');
    console.log(`   • ${stages.length} Maintenance Stages`);
    console.log(`   • ${departments.length} Departments`);
    console.log(`   • ${categories.length} Equipment Categories`);
    console.log(`   • ${users.length} Users (${users.filter(u => u.role === 'admin').length} admins, ${users.filter(u => u.role === 'manager').length} managers, ${technicians.length} technicians, ${regularUsers.length} users)`);
    console.log(`   • ${employees.length} Employees`);
    console.log(`   • ${teams.length} Maintenance Teams`);
    console.log(`   • ${equipment.length} Equipment Items`);
    console.log(`   • ${requests.length} Maintenance Requests\n`);
    console.log('🔑 Test Credentials:');
    console.log('   Admin:     admin@gearguard.com / admin123');
    console.log('   Manager:   michael.chen@gearguard.com / password123');
    console.log('   Technician: john.smith@gearguard.com / password123');
    console.log('   User:      jennifer.lee@gearguard.com / password123\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
