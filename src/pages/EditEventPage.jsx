import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2, FiUpload, FiX } from "react-icons/fi";
import { getEventBySlug, updateEvent, getCategories } from "../services/eventService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function EditEventPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    location: "",
    categoryId: "",
    type: "NORMAL",
    image: "",
    imagePreview: "",
    ticketTypes: [{ name: "General", price: 0, quantity: 100, description: "" }],
    bankName: "",
    bankAccountNumber: "",
    bankAccountName: "",
  });
  const [eventId, setEventId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      getEventBySlug(slug).catch(() => null),
      getCategories().catch(() => []),
    ]).then(([evt, cats]) => {
      if (cats) setCategories(cats);
      if (evt) {
        setEventId(evt._id);
        const start = evt.date || "";
        const end = evt.endDate || "";
        setForm({
          title: evt.title || "",
          description: evt.description || "",
          date: start ? start.split("T")[0] : "",
          time: start ? start.split("T")[1]?.slice(0, 5) || "" : "",
          endDate: end ? end.split("T")[0] : "",
          endTime: end ? end.split("T")[1]?.slice(0, 5) || "" : "",
          location: evt.location || "",
          categoryId: evt.categoryId?.toString() || "",
          type: evt.type || "NORMAL",
          image: evt.image || "",
          imagePreview: evt.image || "",
          ticketTypes: evt.ticketTypes?.length > 0
            ? evt.ticketTypes.map((tt) => ({
                name: tt.name || "General",
                price: tt.price || 0,
                quantity: tt.quantity || 100,
                description: tt.description || "",
              }))
            : [{ name: "General", price: 0, quantity: 100, description: "" }],
          bankName: evt.bankName || "",
          bankAccountNumber: evt.bankAccountNumber || "",
          bankAccountName: evt.bankAccountName || "",
        });
      }
    }).catch(() => toast.error("Event not found"))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");
    const reader = new FileReader();
    reader.onloadend = () => setForm((prev) => ({ ...prev, image: reader.result, imagePreview: reader.result }));
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: "", imagePreview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...form.ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, ticketTypes: updated });
  };

  const addTicketType = () => {
    setForm({
      ...form,
      ticketTypes: [...form.ticketTypes, { name: "", price: 0, quantity: 100, description: "" }],
    });
  };

  const removeTicketType = (index) => {
    if (form.ticketTypes.length <= 1) return;
    setForm({
      ...form,
      ticketTypes: form.ticketTypes.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventId) return toast.error("Event not found");
    setSubmitting(true);
    try {
      await updateEvent(eventId, form);
      toast.success("Event updated!");
      navigate("/dashboard/events");
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner size="lg" className="py-20" />;

  const inputClass = "mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Edit Event</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col gap-5">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Type</label>
          <div className="flex gap-4 mt-2">
            {[
              { value: "NORMAL", label: "Normal Event" },
              { value: "VOTING", label: "Voting Event" },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex-1 p-3 border-2 rounded-xl cursor-pointer transition-all text-center ${
                  form.type === opt.value
                    ? "border-eventify-500 bg-eventify-50 dark:bg-eventify-900/20"
                    : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                }`}
              >
                <input type="radio" name="type" value={opt.value} checked={form.type === opt.value} onChange={handleChange} className="sr-only" />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date</label>
            <input type="date" name="date" value={form.date} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
            <input type="time" name="time" value={form.time} onChange={handleChange} required className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Date</label>
            <input type="date" name="endDate" value={form.endDate} onChange={handleChange} min={form.date} className={inputClass} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange} className={inputClass}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Flyer</label>
          <div className="mt-2">
            {form.imagePreview ? (
              <div className="relative inline-block">
                <img src={form.imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer">
                  <FiX className="text-sm" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()} className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-eventify-400 transition cursor-pointer">
                <FiUpload className="text-2xl text-gray-400" />
                <span className="text-xs text-gray-400">Upload flyer</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ticket Types</label>
            <button type="button" onClick={addTicketType} className="flex items-center gap-1 text-sm text-eventify-600 dark:text-eventify-400 hover:underline cursor-pointer">
              <FiPlus /> Add Tier
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {form.ticketTypes.map((tt, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div className="flex-1 flex flex-col gap-2">
                  <input type="text" placeholder="Tier name" value={tt.name} onChange={(e) => handleTicketChange(i, "name", e.target.value)} required className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <input type="text" placeholder="Description (optional)" value={tt.description} onChange={(e) => handleTicketChange(i, "description", e.target.value)} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  <div className="flex gap-2">
                    <input type="number" placeholder="Price (₦)" value={tt.price} onChange={(e) => handleTicketChange(i, "price", Number(e.target.value))} min="0" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                    <input type="number" placeholder="Qty" value={tt.quantity} onChange={(e) => handleTicketChange(i, "quantity", Number(e.target.value))} min="1" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                  </div>
                </div>
                {form.ticketTypes.length > 1 && (
                  <button type="button" onClick={() => removeTicketType(i)} className="mt-2 text-red-500 hover:text-red-700 cursor-pointer">
                    <FiTrash2 />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Bank Transfer Details</label>
          <div className="flex flex-col gap-3 mt-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Bank Name</label>
              <input type="text" name="bankName" value={form.bankName} onChange={handleChange} placeholder="e.g. GTBank, Access Bank" className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Account Number</label>
              <input type="text" name="bankAccountNumber" value={form.bankAccountNumber} onChange={handleChange} placeholder="0123456789" maxLength={10} className={inputClass} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Account Name</label>
              <input type="text" name="bankAccountName" value={form.bankAccountName} onChange={handleChange} placeholder="John Doe" className={inputClass} />
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-eventify-500 text-white py-3 rounded-lg font-semibold hover:bg-eventify-600 transition disabled:opacity-60 mt-2 cursor-pointer"
        >
          {submitting ? "Updating..." : "Update Event"}
        </button>
      </form>
    </div>
  );
}
