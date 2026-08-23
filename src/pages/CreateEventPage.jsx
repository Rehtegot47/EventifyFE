import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createEvent, getCategories } from "../services/eventService";
import { FiPlus, FiTrash2, FiUpload, FiX, FiCheck, FiArrowLeft, FiArrowRight } from "react-icons/fi";

const STEPS = ["Event Details", "Date & Venue", "Tickets", "Publish"];

const inputClass = "mt-1 w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400";
const smallInputClass = "mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-eventify-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400";

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                i < step
                  ? "bg-eventify-500 text-white"
                  : i === step
                    ? "bg-eventify-500 text-white ring-4 ring-eventify-100 dark:ring-eventify-900"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {i < step ? <FiCheck className="text-base" /> : i + 1}
            </div>
            <span className={`text-xs mt-2 hidden sm:block ${i <= step ? "text-eventify-600 dark:text-eventify-400 font-medium" : "text-gray-400 dark:text-gray-500"}`}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 mt-0 sm:mt-[-18px] ${i < step ? "bg-eventify-500" : "bg-gray-200 dark:bg-gray-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepOne({ form, handleChange, categories }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Title *</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Afrobeat Night 2026" required className={inputClass} />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Tell people what your event is about..." required className={inputClass} />
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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Type *</label>
        <div className="flex gap-4 mt-2">
          {[
            { value: "NORMAL", label: "Normal Event", desc: "Sell tickets for your event" },
            { value: "VOTING", label: "Voting Event", desc: "Let attendees pay to vote" },
          ].map((opt) => (
            <label
              key={opt.value}
              className={`flex-1 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                form.type === opt.value
                  ? "border-eventify-500 bg-eventify-50 dark:bg-eventify-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <input type="radio" name="type" value={opt.value} checked={form.type === opt.value} onChange={handleChange} className="sr-only" />
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{opt.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opt.desc}</div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepTwo({ form, handleChange }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Date *</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Start Time *</label>
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
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Venue *</label>
        <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Eko Convention Centre, Lagos" required className={inputClass} />
      </div>
    </div>
  );
}

function StepThree({ form, ticketTypes, handleTicketChange, addTicketType, removeTicketType, fileInputRef, handleImageUpload, removeImage, uploadingImage }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Event Flyer</label>
        <div className="mt-2">
          {form.imagePreview ? (
            <div className="relative inline-block">
              <img src={form.imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 cursor-pointer"
              >
                <FiX className="text-sm" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="w-40 h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-eventify-400 transition cursor-pointer"
            >
              <FiUpload className="text-2xl text-gray-400" />
              <span className="text-xs text-gray-400">{uploadingImage ? "Uploading..." : "Upload flyer"}</span>
            </button>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Ticket Types *</label>
          <button type="button" onClick={addTicketType} className="flex items-center gap-1 text-sm text-eventify-600 hover:text-eventify-700 cursor-pointer">
            <FiPlus className="text-base" /> Add Tier
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {ticketTypes.map((tt, i) => (
            <div key={i} className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Tier {i + 1}</span>
                {ticketTypes.length > 1 && (
                  <button type="button" onClick={() => removeTicketType(i)} className="text-red-400 hover:text-red-600 cursor-pointer">
                    <FiTrash2 className="text-sm" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Name</label>
                  <input type="text" value={tt.name} onChange={(e) => handleTicketChange(i, "name", e.target.value)} placeholder="e.g. VIP, Early Bird" required className={smallInputClass} />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Description</label>
                  <input type="text" value={tt.description} onChange={(e) => handleTicketChange(i, "description", e.target.value)} placeholder="Optional" className={smallInputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Price (₦)</label>
                  <input type="number" value={tt.price} onChange={(e) => handleTicketChange(i, "price", e.target.value)} min="0" step="0.01" placeholder="0 = free" className={smallInputClass} />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Quantity</label>
                  <input type="number" value={tt.quantity} onChange={(e) => handleTicketChange(i, "quantity", e.target.value)} min="1" placeholder="100" required className={smallInputClass} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepFour({ form, handleChange, ticketTypes }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Event Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Title</span>
            <span className="text-gray-900 dark:text-white font-medium">{form.title || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Type</span>
            <span className="text-gray-900 dark:text-white font-medium">{form.type === "VOTING" ? "Voting Event" : "Normal Event"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Date</span>
            <span className="text-gray-900 dark:text-white font-medium">{form.date || "—"} {form.time}</span>
          </div>
          {form.endDate && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">End Date</span>
              <span className="text-gray-900 dark:text-white font-medium">{form.endDate} {form.endTime}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Venue</span>
            <span className="text-gray-900 dark:text-white font-medium">{form.location || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Tickets</span>
            <span className="text-gray-900 dark:text-white font-medium">{ticketTypes.filter((t) => t.name.trim()).length} tier(s)</span>
          </div>
        </div>
      </div>

      </div>
    );
  }

export default function CreateEventPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    categoryId: "",
    type: "NORMAL",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    location: "",
    image: "",
      imagePreview: "",
    });
  const [ticketTypes, setTicketTypes] = useState([
    { name: "General", price: "", quantity: "", isFree: false, description: "" },
  ]);
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please select an image file");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be under 5MB");

    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, image: reader.result, imagePreview: reader.result }));
      setUploadingImage(false);
    };
    reader.onerror = () => {
      toast.error("Failed to read image");
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: "", imagePreview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleTicketChange = (index, field, value) => {
    const updated = [...ticketTypes];
    updated[index] = { ...updated[index], [field]: value };
    if (field === "price") {
      updated[index].isFree = !value || Number(value) === 0;
    }
    setTicketTypes(updated);
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, { name: "", price: "", quantity: "", isFree: false, description: "" }]);
  };

  const removeTicketType = (index) => {
    if (ticketTypes.length <= 1) return;
    setTicketTypes(ticketTypes.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    if (step === 0) return form.title.trim().length > 0;
    if (step === 1) return form.date && form.time && form.location.trim().length > 0;
    if (step === 2) return ticketTypes.some((t) => t.name.trim());
    return true;
  };

  const handleSubmit = async () => {
    const validTickets = ticketTypes.filter((t) => t.name.trim());
    if (validTickets.length === 0) return toast.error("Add at least one ticket type");
    setSubmitting(true);
    try {
      await createEvent({ ...form, ticketTypes: validTickets });
      toast.success("Event created successfully!");
      navigate("/dashboard/events");
    } catch (err) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Event</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Set up your event in a few steps</p>

      <StepIndicator step={step} />

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        {step === 0 && <StepOne form={form} handleChange={handleChange} categories={categories} />}
        {step === 1 && <StepTwo form={form} handleChange={handleChange} />}
        {step === 2 && (
          <StepThree
            form={form}
            ticketTypes={ticketTypes}
            handleTicketChange={handleTicketChange}
            addTicketType={addTicketType}
            removeTicketType={removeTicketType}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            removeImage={removeImage}
            uploadingImage={uploadingImage}
          />
        )}
        {step === 3 && <StepFour form={form} handleChange={handleChange} ticketTypes={ticketTypes} />}

        <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-200 dark:border-gray-700">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
            >
              <FiArrowLeft /> Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canProceed() && setStep(step + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-2 px-6 py-2.5 bg-eventify-500 text-white text-sm font-semibold rounded-lg hover:bg-eventify-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next <FiArrowRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-eventify-500 text-white text-sm font-semibold rounded-lg hover:bg-eventify-600 transition disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Publishing..." : "Publish Event"} <FiCheck />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
