const express = require('express');
const router = express.Router();

console.log('Initializing category routes...');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: API for category management
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', (req, res) => {
  console.log('GET /api/categories - Getting all categories');
  res.status(200).json({
    success: true,
    message: 'Route for getting all categories. To be implemented.',
  });
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 */
router.get('/:id', (req, res) => {
  console.log(`GET /api/categories/${req.params.id} - Getting category details`);
  res.status(200).json({
    success: true,
    message: `Route for getting category with ID: ${req.params.id}. To be implemented.`,
  });
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent:
 *                 type: string
 *                 description: Parent category ID
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid data
 */
router.post('/', (req, res) => {
  console.log('POST /api/categories - Creating a new category');
  console.log('Request body:', req.body);
  res.status(201).json({
    success: true,
    message: 'Route for creating a new category. To be implemented.',
  });
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               parent:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put('/:id', (req, res) => {
  console.log(`PUT /api/categories/${req.params.id} - Updating category`);
  console.log('Request body:', req.body);
  res.status(200).json({
    success: true,
    message: `Route for updating category with ID: ${req.params.id}. To be implemented.`,
  });
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete('/:id', (req, res) => {
  console.log(`DELETE /api/categories/${req.params.id} - Deleting category`);
  res.status(200).json({
    success: true,
    message: `Route for deleting category with ID: ${req.params.id}. To be implemented.`,
  });
});

console.log('Category routes initialized');

module.exports = router; 