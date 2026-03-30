import { useState } from 'react'
import { 
  ChefHat, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ArrowRight,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Check
} from 'lucide-react'
import { Card, CardHeader, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { useMenuStore } from '../store/menuStore'
import type { MenuItem, RecipeComponent } from '../types'

// Mock menu items
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Grilled Salmon with Asparagus',
    description: 'Atlantic salmon fillet grilled to perfection, served with roasted asparagus and lemon butter sauce.',
    category: 'Entrees',
    price: 28.99,
    cost: 12.50,
    recipe: [
      { ingredientId: '2', ingredientName: 'Atlantic Salmon Fillet', quantity: 0.5, unitOfMeasure: 'lb', unitCost: 8.50, isOptional: false },
      { ingredientId: '7', ingredientName: 'Asparagus', quantity: 0.25, unitOfMeasure: 'lb', unitCost: 2.00, isOptional: false },
      { ingredientId: '8', ingredientName: 'Butter', quantity: 0.05, unitOfMeasure: 'lb', unitCost: 1.00, isOptional: false },
      { ingredientId: '9', ingredientName: 'Lemon', quantity: 0.1, unitOfMeasure: 'lb', unitCost: 0.50, isOptional: false },
    ],
    profitMargin: 56.9,
    foodCostPercentage: 43.1,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: true,
    allergens: ['fish'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Chicken Piccata',
    description: 'Pan-seared chicken breast in a lemon-caper sauce, served with garlic mashed potatoes.',
    category: 'Entrees',
    price: 24.99,
    cost: 9.75,
    recipe: [
      { ingredientId: '1', ingredientName: 'Organic Chicken Breast', quantity: 0.5, unitOfMeasure: 'lb', unitCost: 4.50, isOptional: false },
      { ingredientId: '10', ingredientName: 'Potatoes', quantity: 0.3, unitOfMeasure: 'lb', unitCost: 1.25, isOptional: false },
      { ingredientId: '8', ingredientName: 'Butter', quantity: 0.1, unitOfMeasure: 'lb', unitCost: 2.00, isOptional: false },
      { ingredientId: '9', ingredientName: 'Lemon', quantity: 0.1, unitOfMeasure: 'lb', unitCost: 0.50, isOptional: false },
      { ingredientId: '11', ingredientName: 'Capers', quantity: 0.02, unitOfMeasure: 'lb', unitCost: 1.50, isOptional: false },
    ],
    profitMargin: 61.0,
    foodCostPercentage: 39.0,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['wheat'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Vegetable Stir Fry',
    description: 'Fresh seasonal vegetables stir-fried with ginger and garlic, served over jasmine rice.',
    category: 'Entrees',
    price: 18.99,
    cost: 5.25,
    recipe: [
      { ingredientId: '3', ingredientName: 'Frozen Green Beans', quantity: 0.2, unitOfMeasure: 'lb', unitCost: 0.70, isOptional: false },
      { ingredientId: '12', ingredientName: 'Bell Peppers', quantity: 0.15, unitOfMeasure: 'lb', unitCost: 1.00, isOptional: false },
      { ingredientId: '13', ingredientName: 'Carrots', quantity: 0.1, unitOfMeasure: 'lb', unitCost: 0.30, isOptional: false },
      { ingredientId: '14', ingredientName: 'Jasmine Rice', quantity: 0.2, unitOfMeasure: 'lb', unitCost: 0.75, isOptional: false },
      { ingredientId: '15', ingredientName: 'Soy Sauce', quantity: 0.02, unitOfMeasure: 'lb', unitCost: 0.50, isOptional: false },
      { ingredientId: '16', ingredientName: 'Ginger', quantity: 0.01, unitOfMeasure: 'lb', unitCost: 1.00, isOptional: false },
    ],
    profitMargin: 72.4,
    foodCostPercentage: 27.6,
    isVegetarian: true,
    isVegan: true,
    isGlutenFree: false,
    allergens: ['soy'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Shrimp Scampi',
    description: 'Jumbo shrimp sautéed in garlic butter and white wine, served over linguine.',
    category: 'Entrees',
    price: 26.99,
    cost: 11.00,
    recipe: [
      { ingredientId: '6', ingredientName: 'Frozen Shrimp 16/20', quantity: 0.4, unitOfMeasure: 'lb', unitCost: 5.20, isOptional: false },
      { ingredientId: '17', ingredientName: 'Linguine', quantity: 0.2, unitOfMeasure: 'lb', unitCost: 1.50, isOptional: false },
      { ingredientId: '8', ingredientName: 'Butter', quantity: 0.1, unitOfMeasure: 'lb', unitCost: 2.00, isOptional: false },
      { ingredientId: '18', ingredientName: 'Garlic', quantity: 0.02, unitOfMeasure: 'lb', unitCost: 1.00, isOptional: false },
      { ingredientId: '19', ingredientName: 'White Wine', quantity: 0.05, unitOfMeasure: 'qt', unitCost: 1.30, isOptional: false },
    ],
    profitMargin: 59.2,
    foodCostPercentage: 40.8,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: ['shellfish', 'wheat'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
]

export const MenuEngineering = () => {
  const [menuItems] = useState<MenuItem[]>(mockMenuItems)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  
  const { 
    selectedMenuItems, 
    toggleMenuItemSelection, 
    selectAllMenuItems, 
    deselectAllMenuItems,
    generatedOrder,
    generateOrderFromSelection,
    clearGeneratedOrder
  } = useMenuStore()

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))]

  const filteredItems = menuItems.filter(item => {
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== 'All' && item.category !== selectedCategory) {
      return false
    }
    return true
  })

  const handleGenerateOrder = () => {
    generateOrderFromSelection()
    setShowGenerateModal(true)
  }

  const getMarginColor = (margin: number) => {
    if (margin >= 65) return 'text-green-400'
    if (margin >= 50) return 'text-[#A3E635]'
    if (margin >= 35) return 'text-amber-400'
    return 'text-red-400'
  }

  const getFoodCostColor = (cost: number) => {
    if (cost <= 25) return 'text-green-400'
    if (cost <= 35) return 'text-[#A3E635]'
    if (cost <= 45) return 'text-amber-400'
    return 'text-red-400'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Menu Engineering</h1>
          <p className="text-neutral-400">Analyze menu profitability and generate purchase orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" leftIcon={<Plus className="w-4 h-4" />}>
            Add Menu Item
          </Button>
          {selectedMenuItems.length > 0 && (
            <Button 
              leftIcon={<Package className="w-4 h-4" />}
              onClick={handleGenerateOrder}
            >
              Generate Order ({selectedMenuItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-neutral-500">Total Menu Items</p>
          <p className="text-2xl font-bold text-white">{menuItems.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Avg. Food Cost %</p>
          <p className="text-2xl font-bold text-[#A3E635]">
            {(menuItems.reduce((acc, item) => acc + item.foodCostPercentage, 0) / menuItems.length).toFixed(1)}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Avg. Profit Margin</p>
          <p className="text-2xl font-bold text-green-400">
            {(menuItems.reduce((acc, item) => acc + item.profitMargin, 0) / menuItems.length).toFixed(1)}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-neutral-500">Selected Items</p>
          <p className="text-2xl font-bold text-white">{selectedMenuItems.length}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
            fullWidth
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2.5 rounded-lg bg-[#1A1A1A] border border-white/10 text-white text-sm"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={selectAllMenuItems}>
            Select All
          </Button>
          <Button variant="secondary" size="sm" onClick={deselectAllMenuItems}>
            Clear
          </Button>
        </div>
      </div>

      {/* Menu Items Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-white/20 bg-neutral-800"
                    checked={selectedMenuItems.length === filteredItems.length && filteredItems.length > 0}
                    onChange={() => selectedMenuItems.length === filteredItems.length ? deselectAllMenuItems() : selectAllMenuItems()}
                  />
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Menu Item</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Category</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Price</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Cost</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Food Cost %</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Margin</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-neutral-400">Status</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-neutral-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr 
                  key={item.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-white/20 bg-neutral-800"
                      checked={selectedMenuItems.includes(item.id)}
                      onChange={() => toggleMenuItemSelection(item.id)}
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      <p className="text-sm text-neutral-500 truncate max-w-xs">{item.description}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="default" size="sm">{item.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-white">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right text-neutral-400">
                    ${item.cost.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={getFoodCostColor(item.foodCostPercentage)}>
                      {item.foodCostPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className={getMarginColor(item.profitMargin)}>
                      {item.profitMargin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge variant={item.status === 'active' ? 'success' : 'default'} size="sm">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Order Modal */}
      {showGenerateModal && generatedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-auto">
            <CardHeader 
              title="Generated Purchase Order"
              subtitle={`Based on ${selectedMenuItems.length} selected menu items`}
              action={
                <button 
                  onClick={() => setShowGenerateModal(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-neutral-400 hover:text-white"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              }
            />
            <CardContent>
              <div className="space-y-4">
                <div className="bg-[#65A30D]/10 border border-[#65A30D]/30 rounded-lg p-4">
                  <p className="text-sm text-[#A3E635]">
                    <Check className="w-4 h-4 inline mr-2" />
                    Order generated successfully! Review the items below and proceed to create an RFQ.
                  </p>
                </div>
                
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-2 px-3 text-sm font-medium text-neutral-400">Ingredient</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-neutral-400">Quantity</th>
                      <th className="text-left py-2 px-3 text-sm font-medium text-neutral-400">Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedOrder.map((item, index) => (
                      <tr key={index} className="border-b border-white/5">
                        <td className="py-2 px-3 text-white">{item.ingredientName}</td>
                        <td className="py-2 px-3 text-right text-white">{item.quantity.toFixed(2)}</td>
                        <td className="py-2 px-3 text-neutral-400">{item.unitOfMeasure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="flex gap-3 pt-4">
                  <Button 
                    fullWidth 
                    leftIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => {
                      setShowGenerateModal(false)
                      // Navigate to RFQ wizard with generated order
                    }}
                  >
                    Create RFQ
                  </Button>
                  <Button 
                    variant="outline" 
                    fullWidth
                    onClick={() => {
                      clearGeneratedOrder()
                      setShowGenerateModal(false)
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
