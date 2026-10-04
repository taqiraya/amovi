import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  MapPin, 
  Compass, 
  Search, 
  Home, 
  Download
} from 'lucide-react';
import { getMasterRequests, getContactMessages } from '../../services/api';
import localDb from '../../../db.json';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('bookings');
  const [searchTerm, setSearchTerm] = useState('');
  const [masterRequests, setMasterRequests] = useState(localDb.masterRequests || []);
  const [contactMessages, setContactMessages] = useState(localDb.contactMessages || []);
  const [provinces] = useState(localDb.provinces || []);
  const [tours] = useState(localDb.tours || []);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getMasterRequests().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setMasterRequests(data);
      }
    });

    getContactMessages().then((data) => {
      if (isMounted && Array.isArray(data) && data.length > 0) {
        setContactMessages(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalDestinations = provinces.reduce((acc, p) => acc + (p.sub_destinations?.length || 0), 0);

  const filteredRequests = masterRequests.filter((req) => {
    const q = searchTerm.toLowerCase();
    return (
      (req.fullName || '').toLowerCase().includes(q) ||
      (req.email || '').toLowerCase().includes(q) ||
      (req.packageOrService || '').toLowerCase().includes(q) ||
      (req.phoneWhatsApp || '').toLowerCase().includes(q)
    );
  });

  const filteredMessages = contactMessages.filter((msg) => {
    const q = searchTerm.toLowerCase();
    return (
      (msg.fullName || '').toLowerCase().includes(q) ||
      (msg.email || '').toLowerCase().includes(q) ||
      (msg.subject || '').toLowerCase().includes(q) ||
      (msg.message || '').toLowerCase().includes(q)
    );
  });

  const exportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ masterRequests, contactMessages }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `amovi_admin_export_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans flex flex-col w-full overflow-x-hidden">
      {/* Top Admin Navbar */}
      <header className="bg-[#1E293B] border-b border-slate-700/80 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FCA311] flex items-center justify-center text-[#14213D] font-black text-lg sm:text-xl shadow-md shrink-0">
            A
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
              Amovi Travel Control Hub
              <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Live Admin
              </span>
            </h1>
            <p className="text-[11px] sm:text-xs text-slate-400">Master Operations & Communications Management</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={exportData}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#FCA311] hover:bg-amber-500 text-xs font-bold text-[#14213D] transition shadow-md"
          >
            <Home size={14} />
            <span>Return to Website</span>
          </Link>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Bookings & Inquiries</span>
              <Users size={18} className="text-[#FCA311]" />
            </div>
            <div className="text-2xl font-black text-white">{masterRequests.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Direct travel requests</div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Contact Messages</span>
              <Mail size={18} className="text-sky-400" />
            </div>
            <div className="text-2xl font-black text-white">{contactMessages.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">General inquiries</div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Provinces</span>
              <MapPin size={18} className="text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">{provinces.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">{totalDestinations} documented places</div>
          </div>

          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Tour Packages</span>
              <Compass size={18} className="text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{tours.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">Curated expeditions</div>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1E293B] p-3 rounded-2xl border border-slate-700/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActiveTab('bookings'); setSelectedItem(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Master Requests ({masterRequests.length})
            </button>
            <button
              onClick={() => { setActiveTab('messages'); setSelectedItem(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'messages'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Contact Messages ({contactMessages.length})
            </button>
            <button
              onClick={() => { setActiveTab('provinces'); setSelectedItem(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'provinces'
                  ? 'bg-[#FCA311] text-[#14213D] shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Provinces & Sights ({provinces.length})
            </button>
          </div>

          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FCA311]"
            />
          </div>
        </div>

        {/* Tab 1: Bookings / Master Requests */}
        {activeTab === 'bookings' && (
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Client Booking & Itinerary Inquiries</h3>
              <span className="text-xs text-slate-400">{filteredRequests.length} results</span>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No booking requests match your search criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
                    <tr>
                      <th className="py-3 px-4">Client Name</th>
                      <th className="py-3 px-4">Contact Info</th>
                      <th className="py-3 px-4">Package / Service</th>
                      <th className="py-3 px-4">Date / Travelers</th>
                      <th className="py-3 px-4">Submitted At</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredRequests.map((req, idx) => (
                      <tr key={req.id || idx} className="hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {req.fullName || 'Anonymous Traveler'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-slate-300">{req.email || '-'}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{req.phoneWhatsApp || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-amber-400">
                          {req.packageOrService || 'Custom Journey'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          <div>{req.preferredDate || 'Flexible'}</div>
                          {req.travelers && <div className="text-[11px] text-slate-400">{req.travelers} Guests</div>}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                          {req.submittedAt ? new Date(req.submittedAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedItem(req)}
                            className="px-3 py-1 rounded-lg bg-[#FCA311]/15 text-[#FCA311] hover:bg-[#FCA311] hover:text-[#14213D] font-bold text-[11px] transition cursor-pointer"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Contact Messages */}
        {activeTab === 'messages' && (
          <div className="bg-[#1E293B] border border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Website Contact Messages</h3>
              <span className="text-xs text-slate-400">{filteredMessages.length} results</span>
            </div>

            {filteredMessages.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No contact messages found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-700/60">
                    <tr>
                      <th className="py-3 px-4">Sender Name</th>
                      <th className="py-3 px-4">Email & Phone</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4">Message Snippet</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMessages.map((msg, idx) => (
                      <tr key={msg.id || idx} className="hover:bg-slate-800/50 transition">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {msg.fullName || 'Visitor'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{msg.email || '-'}</div>
                          <div className="text-slate-400 text-[11px] font-mono">{msg.phoneWhatsApp || '-'}</div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-sky-400">
                          {msg.subject || 'General Inquiry'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 line-clamp-1 max-w-xs">
                          {msg.message || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedItem(msg)}
                            className="px-3 py-1 rounded-lg bg-sky-500/15 text-sky-400 hover:bg-sky-400 hover:text-[#14213D] font-bold text-[11px] transition cursor-pointer"
                          >
                            Read Full
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Provinces & Sights Summary */}
        {activeTab === 'provinces' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {provinces.map((prov) => (
              <div key={prov.slug} className="bg-[#1E293B] border border-slate-700/60 rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-mono text-amber-400">{prov.slug}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-bold">
                      {prov.sub_destinations?.length || 0} places
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{prov.en?.name} / {prov.fa?.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{prov.en?.intro || prov.fa?.intro}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{prov.gallery?.length || 0} gallery photos</span>
                  <Link
                    to={`/destinations/${prov.slug}`}
                    target="_blank"
                    className="text-[#FCA311] hover:underline font-bold"
                  >
                    View Live Page &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div 
              className="bg-[#1E293B] border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl text-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-4">
                <h3 className="font-bold text-white text-base">Inquiry Details</h3>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-slate-400 hover:text-white font-bold text-sm cursor-pointer"
                >
                  &times; Close
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Full Name:</span>
                  <span className="text-white font-bold text-sm">{selectedItem.fullName || '-'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block font-semibold">Email:</span>
                    <a href={`mailto:${selectedItem.email}`} className="text-sky-400 hover:underline">{selectedItem.email || '-'}</a>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Phone / WhatsApp:</span>
                    <a href={`tel:${selectedItem.phoneWhatsApp}`} className="text-emerald-400 font-mono">{selectedItem.phoneWhatsApp || '-'}</a>
                  </div>
                </div>

                {selectedItem.packageOrService && (
                  <div>
                    <span className="text-slate-400 block font-semibold">Package / Service:</span>
                    <span className="text-amber-400 font-bold">{selectedItem.packageOrService}</span>
                  </div>
                )}

                {selectedItem.subject && (
                  <div>
                    <span className="text-slate-400 block font-semibold">Subject:</span>
                    <span className="text-sky-400 font-bold">{selectedItem.subject}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block font-semibold">Message / Additional Requirements:</span>
                  <div className="mt-1 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 leading-relaxed whitespace-pre-wrap text-slate-300">
                    {selectedItem.additionalRequirements || selectedItem.message || 'No additional details provided.'}
                  </div>
                </div>

                {selectedItem.submittedAt && (
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-700">
                    Submitted: {new Date(selectedItem.submittedAt).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}