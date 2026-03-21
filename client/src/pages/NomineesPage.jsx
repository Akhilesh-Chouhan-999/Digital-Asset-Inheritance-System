import React, { useState, useEffect } from "react";
import { nomineeService, assetService } from "../services/api";
import { Modal, Alert, Loading, EmptyState, Badge } from "../components/Common";
import { Plus, Users, Trash2, CheckCircle, Clock } from "lucide-react";
import "./Nominees.css";

export const NomineesPage = () => {
  const [nominees, setNominees] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedNominee, setSelectedNominee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    relationship: "",
  });
  const [selectedAssets, setSelectedAssets] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      const [nomineesRes, assetsRes] = await Promise.all([
        nomineeService.getNominees(),
        assetService.getAssets(),
      ]);
      setNominees(nomineesRes.data.data || []);
      setAssets(assetsRes.data.data || []);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({ name: "", email: "", relationship: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setError("");
      await nomineeService.addNominee(formData);
      setSuccess("Nominee added successfully!");
      setShowModal(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add nominee");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this nominee?")) {
      try {
        setError("");
        await nomineeService.deleteNominee(id);
        setSuccess("Nominee removed successfully!");
        await loadData();
      } catch (err) {
        setError("Failed to remove nominee");
      }
    }
  };

  const handleShare = async () => {
    if (selectedAssets.length === 0) {
      setError("Please select at least one asset");
      return;
    }

    try {
      setError("");
      for (const assetId of selectedAssets) {
        await assetService.shareAsset(assetId, selectedNominee._id);
      }
      setSuccess("Assets shared successfully!");
      setShowShareModal(false);
      setSelectedAssets([]);
      await loadData();
    } catch (err) {
      setError("Failed to share assets");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "verified":
        return <Badge type="success">✓ Verified</Badge>;
      case "pending":
        return <Badge type="warning">⏱ Pending</Badge>;
      case "rejected":
        return <Badge type="danger">✗ Rejected</Badge>;
      default:
        return <Badge type="info">{status}</Badge>;
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="nominees-container">
      <div className="nominees-header">
        <div>
          <h1>Nominees</h1>
          <p>Manage your nominated beneficiaries</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenModal}>
          <Plus size={20} />
          Add Nominee
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

      {nominees.length > 0 ? (
        <div className="nominees-list">
          {nominees.map((nominee) => (
            <div key={nominee._id} className="nominee-card">
              <div className="nominee-header">
                <div className="nominee-avatar">
                  {nominee.name.charAt(0).toUpperCase()}
                </div>
                <div className="nominee-info">
                  <h3 className="nominee-name">{nominee.name}</h3>
                  <p className="nominee-email">{nominee.email}</p>
                  <p className="nominee-relationship">{nominee.relationship}</p>
                </div>
                <div className="nominee-status">
                  {getStatusBadge(nominee.status)}
                </div>
              </div>

              <div className="nominee-footer">
                <button
                  className="btn btn-sm btn-primary flex-1"
                  onClick={() => {
                    setSelectedNominee(nominee);
                    setSelectedAssets([]);
                    setShowShareModal(true);
                  }}
                >
                  Share Assets
                </button>
                <button
                  className="btn btn-sm btn-danger flex-1"
                  onClick={() => handleDelete(nominee._id)}
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No Nominees Yet"
          description="Add nominees who will inherit your digital assets"
          action={{ label: "Add Nominee", onClick: handleOpenModal }}
        />
      )}

      {/* Add Nominee Modal */}
      <Modal
        isOpen={showModal}
        title="Add New Nominee"
        onClose={() => setShowModal(false)}
        footer={
          <div className="modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Add Nominee
            </button>
          </div>
        }
      >
        <form className="nominee-form">
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              placeholder="nominee@email.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="relationship">Relationship</label>
            <input
              id="relationship"
              type="text"
              placeholder="e.g., Spouse, Child, Parent"
              value={formData.relationship}
              onChange={(e) =>
                setFormData({ ...formData, relationship: e.target.value })
              }
            />
          </div>
        </form>
      </Modal>

      {/* Share Assets Modal */}
      <Modal
        isOpen={showShareModal}
        title={`Share Assets with ${selectedNominee?.name}`}
        onClose={() => setShowShareModal(false)}
        size="md"
        footer={
          <div className="modal-actions">
            <button
              className="btn btn-outline"
              onClick={() => setShowShareModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleShare}>
              Share Selected
            </button>
          </div>
        }
      >
        <div className="share-assets-form">
          <p className="mb-2">Select assets to share with this nominee:</p>
          <div className="assets-checkboxes">
            {assets.length > 0 ? (
              assets.map((asset) => (
                <label key={asset._id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={selectedAssets.includes(asset._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssets([...selectedAssets, asset._id]);
                      } else {
                        setSelectedAssets(
                          selectedAssets.filter((id) => id !== asset._id),
                        );
                      }
                    }}
                  />
                  <span className="checkbox-label">
                    <strong>{asset.title}</strong>
                    <span className="asset-type">{asset.type}</span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-muted">No assets available</p>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NomineesPage;
