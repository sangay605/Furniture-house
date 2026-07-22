import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { FurnitureItem, ItemCondition, RoomCategory } from '../types';
import { 
  Box, AlertTriangle, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, 
  Search, Download, RefreshCw, CheckCircle2, MapPin, Tag, ShieldCheck, History
} from 'lucide-react';

export const InventoryManager: React.FC = () => {
  const { 
    catalog, updateStock, addProduct, editProduct, deleteProduct, 
    inventoryLogs, cart 
  } = useShop();

  const [activeSubTab, setActiveSubTab] = useState<'table' | 'logs'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterCondition, setFilterCondition] = useState('All');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<FurnitureItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Living Room' as RoomCategory,
    msrp: 1000,
    outletPrice: 500,
    condition: 'Open Box' as ItemCondition,
    conditionNote: '',
    stockCount: 2,
    aisleLocation: 'Aisle A-01 / Rack 1',
    widthInches: 60,
    depthInches: 30,
    heightInches: 30,
    weightLbs: 80,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    description: '',
    arModelType: 'sofa' as FurnitureItem['arModelType']
  });

  // Calculate Metrics
  const totalSkus = catalog.length;
  const lowStockCount = catalog.filter((i) => i.stockCount <= 2).length;
  const reservedInCartsCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const totalValueMsrp = catalog.reduce((sum, i) => sum + i.msrp * i.stockCount, 0);
  const totalValueOutlet = catalog.reduce((sum, i) => sum + i.outletPrice * i.stockCount, 0);

  // Filter Catalog
  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aisleLocation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesCondition = filterCondition === 'All' || item.condition === filterCondition;

    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      sku: `OUT-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Living Room',
      msrp: 1200,
      outletPrice: 590,
      condition: 'Open Box',
      conditionNote: 'Floor display intake inspected by warehouse team.',
      stockCount: 3,
      aisleLocation: 'Aisle B-02 / Rack 1',
      widthInches: 64,
      depthInches: 32,
      heightInches: 34,
      weightLbs: 90,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      description: 'Designer outlet furniture piece with verified quality rating.',
      arModelType: 'sofa'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: FurnitureItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      sku: item.sku,
      category: item.category,
      msrp: item.msrp,
      outletPrice: item.outletPrice,
      condition: item.condition,
      conditionNote: item.conditionNote || '',
      stockCount: item.stockCount,
      aisleLocation: item.aisleLocation,
      widthInches: item.dimensions.widthInches,
      depthInches: item.dimensions.depthInches,
      heightInches: item.dimensions.heightInches,
      weightLbs: item.dimensions.weightLbs,
      image: item.image,
      description: item.description,
      arModelType: item.arModelType
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const discount = Math.round(((formData.msrp - formData.outletPrice) / formData.msrp) * 100);

    const productPayload = {
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      msrp: Number(formData.msrp),
      outletPrice: Number(formData.outletPrice),
      discountPercent: Math.max(0, discount),
      condition: formData.condition,
      conditionNote: formData.conditionNote,
      stockCount: Number(formData.stockCount),
      aisleLocation: formData.aisleLocation,
      dimensions: {
        widthInches: Number(formData.widthInches),
        depthInches: Number(formData.depthInches),
        heightInches: Number(formData.heightInches),
        weightLbs: Number(formData.weightLbs)
      },
      image: formData.image,
      gallery: [formData.image],
      description: formData.description,
      colorOptions: ['Standard Finish'],
      materials: ['Solid Hardwood', 'High-Resilience Foam'],
      arModelType: formData.arModelType,
      rating: 4.8,
      reviewsCount: 12
    };

    if (editingItem) {
      editProduct({ ...productPayload, id: editingItem.id });
    } else {
      addProduct(productPayload);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16 text-white">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <Box className="w-5 h-5 text-amber-400" />
            <h1 className="text-2xl font-black font-display">Outlet Inventory Control Hub</h1>
          </div>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Manage warehouse stock levels, intake floor models, reallocate aisle locations, and review audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center space-x-2 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Intake New Outlet Item</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 font-medium block">Total Active SKUs</span>
          <span className="text-2xl font-extrabold text-white font-mono">{totalSkus}</span>
          <span className="text-[10px] text-zinc-500 block">Across 6 warehouse aisles</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-amber-400 font-medium block flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />
            Low Stock Alerts
          </span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">{lowStockCount} Items</span>
          <span className="text-[10px] text-zinc-500 block">Less than 2 units in stock</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 font-medium block">Active Cart Holds</span>
          <span className="text-2xl font-extrabold text-white font-mono">{reservedInCartsCount} Units</span>
          <span className="text-[10px] text-zinc-500 block">Reserved under 15-min timers</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl space-y-1">
          <span className="text-xs text-zinc-400 font-medium block">Total Outlet Value</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">
            ${totalValueOutlet.toLocaleString()}
          </span>
          <span className="text-[10px] text-zinc-500 block">MSRP MSRP: ${totalValueMsrp.toLocaleString()}</span>
        </div>
      </div>

      {/* Sub Tabs: Inventory Table vs Activity Logs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
          <div className="flex bg-zinc-800 p-1 rounded-2xl border border-zinc-700/60 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('table')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                activeSubTab === 'table' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Stock Table</span>
            </button>

            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
                activeSubTab === 'logs' ? 'bg-amber-500 text-zinc-950 font-bold shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Logs ({inventoryLogs.length})</span>
            </button>
          </div>

          {activeSubTab === 'table' && (
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter SKU or item..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-800 text-white pl-9 pr-3 py-1.5 rounded-xl border border-zinc-700 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-zinc-800 text-white text-xs px-3 py-1.5 rounded-xl border border-zinc-700"
              >
                <option value="All">All Categories</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Dining">Dining</option>
                <option value="Office">Office</option>
                <option value="Outdoor">Outdoor</option>
              </select>
            </div>
          )}
        </div>

        {/* SUB TAB 1: Inventory Table */}
        {activeSubTab === 'table' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-zinc-800/80 text-zinc-400 uppercase font-mono text-[10px] tracking-wider border-b border-zinc-700/60">
                <tr>
                  <th className="py-3 px-4">Item & SKU</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Aisle Location</th>
                  <th className="py-3 px-4">Outlet Pricing</th>
                  <th className="py-3 px-4">Stock Level</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredCatalog.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-zinc-700"
                        />
                        <div>
                          <span className="font-bold text-white block line-clamp-1">{item.name}</span>
                          <span className="text-[10px] font-mono text-amber-400">{item.sku}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 border border-zinc-700 text-zinc-300">
                        {item.condition}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-zinc-300">
                      <span className="flex items-center">
                        <MapPin className="w-3 h-3 text-amber-400 mr-1" />
                        {item.aisleLocation}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono">
                      <span className="text-amber-400 font-bold block">${item.outletPrice}</span>
                      <span className="text-zinc-500 line-through text-[10px]">MSRP ${item.msrp}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateStock(item.id, item.stockCount - 1, 'Manual staff decrease')}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-300 flex items-center justify-center"
                        >
                          -
                        </button>

                        <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                          item.stockCount <= 2 ? 'bg-amber-950 text-amber-400 border border-amber-600/40' : 'text-white'
                        }`}>
                          {item.stockCount}
                        </span>

                        <button
                          onClick={() => updateStock(item.id, item.stockCount + 1, 'Manual staff increase')}
                          className="w-6 h-6 rounded bg-zinc-800 hover:bg-zinc-700 font-bold text-zinc-300 flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                          title="Edit Item"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-300 rounded-lg transition-colors"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUB TAB 2: Audit Movement Logs */}
        {activeSubTab === 'logs' && (
          <div className="space-y-3">
            <span className="text-xs text-zinc-400 block font-medium">
              Real-time stock movement, restock, and customer sale history logs.
            </span>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {inventoryLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-zinc-800/80 p-3.5 rounded-2xl border border-zinc-700/60 text-xs flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.type === 'Restock' ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' :
                        log.type === 'Sale' ? 'bg-blue-950 text-blue-300 border border-blue-600/40' :
                        'bg-amber-950 text-amber-300 border border-amber-600/40'
                      }`}>
                        {log.type}
                      </span>
                      <strong className="text-white">{log.itemName}</strong>
                    </div>

                    <p className="text-zinc-400 text-[11px]">{log.note}</p>
                  </div>

                  <div className="text-right font-mono">
                    <span className={`font-bold block ${log.quantityChange > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange} units
                    </span>
                    <span className="text-[10px] text-zinc-500 block">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl text-white space-y-5 my-8">
            <h3 className="text-lg font-bold border-b border-zinc-800 pb-3">
              {editingItem ? 'Edit Outlet Item' : 'Intake New Outlet Floor Model / Overstock'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Outlet SKU</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RoomCategory })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  >
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Dining">Dining</option>
                    <option value="Office">Office</option>
                    <option value="Outdoor">Outdoor</option>
                    <option value="Clearance">Clearance</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as ItemCondition })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  >
                    <option value="Brand New">Brand New</option>
                    <option value="Open Box">Open Box</option>
                    <option value="Floor Model">Floor Model</option>
                    <option value="Scratch & Dent">Scratch & Dent</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Warehouse Aisle Location</label>
                  <input
                    type="text"
                    required
                    value={formData.aisleLocation}
                    onChange={(e) => setFormData({ ...formData, aisleLocation: e.target.value })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Original MSRP ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.msrp}
                    onChange={(e) => setFormData({ ...formData, msrp: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Outlet Price ($)</label>
                  <input
                    type="number"
                    required
                    value={formData.outletPrice}
                    onChange={(e) => setFormData({ ...formData, outletPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockCount}
                    onChange={(e) => setFormData({ ...formData, stockCount: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Width (in)</label>
                  <input
                    type="number"
                    value={formData.widthInches}
                    onChange={(e) => setFormData({ ...formData, widthInches: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Depth (in)</label>
                  <input
                    type="number"
                    value={formData.depthInches}
                    onChange={(e) => setFormData({ ...formData, depthInches: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Height (in)</label>
                  <input
                    type="number"
                    value={formData.heightInches}
                    onChange={(e) => setFormData({ ...formData, heightInches: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block font-medium mb-1">Weight (lbs)</label>
                  <input
                    type="number"
                    value={formData.weightLbs}
                    onChange={(e) => setFormData({ ...formData, weightLbs: Number(e.target.value) })}
                    className="w-full bg-zinc-800 text-white p-2 rounded-xl border border-zinc-700 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block font-medium mb-1">Condition Inspection Note</label>
                <input
                  type="text"
                  value={formData.conditionNote}
                  onChange={(e) => setFormData({ ...formData, conditionNote: e.target.value })}
                  className="w-full bg-zinc-800 text-white p-2.5 rounded-xl border border-zinc-700"
                  placeholder="e.g. Minor scuff on lower leg, inspected by team."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 text-zinc-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold rounded-xl shadow-md"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
