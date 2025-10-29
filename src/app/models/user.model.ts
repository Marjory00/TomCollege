
// src/app/models/user.model.ts

const Class = require('../models/Class');
const Student = require('../models/Student');

// @desc    Get all classes
// @route   GET /api/classes
// @access  Private
exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'firstName lastName email')
      .populate('enrolledStudents', 'studentId');

    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single class
// @route   GET /api/classes/:id
// @access  Private
exports.getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id)
      .populate('teacher', 'firstName lastName email phone')
      .populate({
        path: 'enrolledStudents',
        populate: { path: 'userId', select: 'firstName lastName email' }
      });

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new class
// @route   POST /api/classes
// @access  Private (admin)
exports.createClass = async (req, res) => {
  try {
    const classData = await Class.create(req.body);

    res.status(201).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update class
// @route   PUT /api/classes/:id
// @access  Private (admin, teacher)
exports.updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete class
// @route   DELETE /api/classes/:id
// @access  Private (admin)
exports.deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete(req.params.id);

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Enroll student in class
// @route   POST /api/classes/:id/enroll
// @access  Private (admin)
exports.enrollStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Check if class is full
    if (classData.enrolledStudents.length >= classData.maxStudents) {
      return res.status(400).json({
        success: false,
        message: 'Class is full'
      });
    }

    // Check if student is already enrolled
    if (classData.enrolledStudents.includes(studentId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this class'
      });
    }

    classData.enrolledStudents.push(studentId);
    await classData.save();

    student.classes.push(classData._id);
    await student.save();

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Remove student from class
// @route   DELETE /api/classes/:id/students/:studentId
// @access  Private (admin)
exports.removeStudent = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const classData = await Class.findById(id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    classData.enrolledStudents = classData.enrolledStudents.filter(
      s => s.toString() !== studentId
    );
    await classData.save();

    student.classes = student.classes.filter(
      c => c.toString() !== id
    );
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Student removed from class successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
