import React, { useState, useEffect } from "react";
import { assetService } from "../services/api";
import { Modal, Alert, Loading, EmptyState } from "../components/Common";
import { Plus, Lock, Edit2, Trash2, Share2, Archive, Eye } from "lucide-react";
import "./Assets.css";

export const AssetsPage = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "password",
    assetContent: "",
    visibility: "private",
    description: "",
  });

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      setError("");
      const response = await assetService.getAssets();
      setAssets(response.data.data || []);
    } catch (err) {
      setError("Failed to load assets");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode, asset = null) => {
    setModalMode(mode);
    if (asset) {
      setSelectedAsset(asset);
      setFormData({
        title: asset.title,
        type: asset.type,
        assetContent: asset.assetContent,
        visibility: asset.visibility,
        description: asset.description || "",
      });
    } else {
      setFormData({
        title: "",
        type: "password",
        assetContent: "",
        visibility: "private",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.assetContent) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      if (modalMode === "create") {
        await assetService.createAsset(formData);
        setSuccess("Asset created successfully!");
      } else {
        await assetService.updateAsset(selectedAsset._id, formData);
        setSuccess("Asset updated successfully!");
      }
      setShowModal(false);
      await loadAssets();
    } catch (err) {
      setError(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      try {
        setError("");
        await assetService.deleteAsset(id);
        setSuccess("Asset deleted successfully!");
        await loadAssets();
      } catch (err) {
        setError("Failed to delete asset");
      }
    }
  };

  const handleArchive = async (id) => {
    try {
      setError("");
      await assetService.archiveAsset(id);
      setSuccess("Asset archived successfully!");
      await loadAssets();
    } catch (err) {
      setError("Failed to archive asset");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="assets-container">
      <div className="assets-header">
        <div>
          <h1>My Digital Assets</h1>
          <p>Create and manage your digital assets securely</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => handleOpenModal("create")}
        >
          <Plus size={20} />
          New Asset
        </button>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError("")} />
      )}
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess("")}
        />
      )}

      {assets.length > 0 ? (
        <div className="assets-grid">
          {assets.map((asset) => (
            <div key={asset._id} className="asset-card">
              <div className="asset-card-header">
                <div className="asset-card-icon">
                  <Lock size={24} />
                </div>
                <div className="asset-card-actions">
                  <button
                    className="icon-btn"
                    onClick={() => handleOpenModal("edit", asset)}
                    title="Edit"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => handleDelete(asset._id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="asset-card-body">
                <h3 className="asset-card-title">{asset.title}</h3>
                <p className="asset-card-type">{asset.type}</p>
                <p className="asset-card-description">{asset.description}</p>

                <div className="asset-card-meta">
                  <span className={`badge badge-${asset.visibility}`}>
                    {asset.visibility.replace("_", " ")}
                  </span>
                  <span className="text-small text-muted">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="asset-card-footer">
                <button
                  className="btn btn-sm btn-outline flex-1"
                  onClick={() => handleArchive(asset._id)}
                >
                  <Archive size={16} />
                  Archive
                </button>
                <button className="btn btn-sm btn-outline flex-1">
                  <Share2 size={16} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Lock}
          title="No Assets Found"
          description="Create your first digital asset to get started"
          action={{
            label: "Create Asset",
            onClick: () => handleOpenModal("create"),
          }}
        />
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        title={modalMode === "create" ? "Create New Asset" : "Edit Asset"}
        onClose={() => setShowModal(false)}
        size="md"
        footer={
          <div className="modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {modalMode === "create" ? "Create" : "Update"} Asset
            </button>
          </div>
        }
      >
        <form className="asset-form">
          <div className="form-group">
            <label htmlFor="title">Asset Title *</label>
            <input
              id="title"
              type="text"
              placeholder="e.g., Bank Account Password"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Asset Type *</label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
            >
              <option value="password">Password</option>
              <option value="document">Document</option>
              <option value="financial">Financial Info</option>
              <option value="social">Social Media</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="visibility">Visibility *</label>
            <select
              id="visibility"
              value={formData.visibility}
              onChange={(e) =>
                setFormData({ ...formData, visibility: e.target.value })
              }
            >
              <option value="private">Private (Only Me)</option>
              <option value="nominee_only">Nominee Only</option>
              <option value="on_death">On Death</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Additional details about this asset..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="assetContent">Asset Content *</label>
            <textarea
              id="assetContent"
              placeholder="Password, account details, or other sensitive information..."
              value={formData.assetContent}
              onChange={(e) =>
                setFormData({ ...formData, assetContent: e.target.value })
              }
              rows={5}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetsPage;
