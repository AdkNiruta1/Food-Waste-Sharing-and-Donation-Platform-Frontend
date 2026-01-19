import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/badge";
import { Input } from "../../../../components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter ,DialogDescription } from "../../../../components/ui/dialog";
import { useState, useEffect } from "react";
import { 
  Search, 
  Mail, 
  User, 
  Clock, 
  MessageSquare, 
  Tag, 
  Filter, 
  Eye, 
  Trash2, 
  CheckCircle, 
  Archive,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Bell,
  ExternalLink,
  Hash,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useGetContactMessages } from "../hooks/useGetContactMessage";

export const AdminViewContactMessage = () => {
  const { error, loading, fetchMessages, messages, pagination } = useGetContactMessages();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [expandedMessages, setExpandedMessages] = useState({});

  useEffect(() => {
    fetchMessages(currentPage, 10);
  }, [currentPage]);

  const toggleMessageExpand = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  // Filter messages based on criteria
  const filteredMessages = messages.filter((message) => {
    const matchesSearch = 
      message.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || message.status === statusFilter;
    const matchesType = typeFilter === "all" || message.inquiryType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return { 
          bg: "bg-blue-100 text-blue-800",
          icon: <Bell className="h-3 w-3" />,
          label: "New"
        };
      case 'read':
        return { 
          bg: "bg-emerald-100 text-emerald-800",
          icon: <CheckCircle className="h-3 w-3" />,
          label: "Read"
        };
      case 'archived':
        return { 
          bg: "bg-slate-100 text-slate-800",
          icon: <Archive className="h-3 w-3" />,
          label: "Archived"
        };
      default:
        return { 
          bg: "bg-slate-100 text-slate-800",
          icon: <MessageSquare className="h-3 w-3" />,
          label: status
        };
    }
  };

  // Type badge styling
  const getTypeBadge = (type) => {
    switch (type) {
      case 'general':
        return { 
          bg: "bg-purple-100 text-purple-800",
          icon: <MessageSquare className="h-3 w-3" />,
          label: "General Inquiry"
        };
      case 'support':
        return { 
          bg: "bg-amber-100 text-amber-800",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "Support Request"
        };
      case 'feedback':
        return { 
          bg: "bg-cyan-100 text-cyan-800",
          icon: <Tag className="h-3 w-3" />,
          label: "Feedback"
        };
      case 'bug':
        return { 
          bg: "bg-rose-100 text-rose-800",
          icon: <AlertCircle className="h-3 w-3" />,
          label: "partnership"
        };
      default:
        return { 
          bg: "bg-slate-100 text-slate-800",
          icon: <Tag className="h-3 w-3" />,
          label: type
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setDetailsModalOpen(true);
  };

  const handleMarkAsRead = (message) => {
    // Implement mark as read functionality
    console.log("Mark as read:", message._id);
  };

  const handleArchive = (message) => {
    // Implement archive functionality
    console.log("Archive:", message._id);
  };

  const handleDelete = (message) => {
    // Implement delete functionality
    console.log("Delete:", message._id);
  };

  const handleReply = (message) => {
    // Implement reply functionality
    window.location.href = `mailto:${message.email}?subject=Re: ${message.subject}`;
  };

  const totalPages = pagination?.totalPages || 1;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <Card className="p-8 rounded-2xl border-slate-200/80 shadow-lg">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Error Loading Messages</h3>
          <p className="text-slate-600">{error}</p>
          <Button 
            onClick={() => fetchMessages()} 
            className="mt-4 bg-gradient-to-r from-emerald-500 to-emerald-600"
          >
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-white">
      {/* Modern Header */}
      <div className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Contact Messages
              </h1>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Manage and respond to user inquiries and feedback
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-500 bg-slate-100/80 px-4 py-2 rounded-full">
                <span className="font-semibold text-slate-900">{messages.length}</span> total messages
              </div>
              <div className="text-sm text-slate-500 bg-blue-100/80 px-4 py-2 rounded-full">
                <span className="font-semibold text-blue-900">
                  {messages.filter(m => m.status === 'new').length}
                </span> new messages
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <Card className="p-6 rounded-2xl border-slate-200/80 shadow-sm bg-white/90 backdrop-blur-sm">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Search Messages
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search by name, email, or subject..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-slate-300/80"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300/80 bg-white focus:border-emerald-400 focus:ring-emerald-400/20"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Inquiry Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-slate-300/80 bg-white focus:border-emerald-400 focus:ring-emerald-400/20"
              >
                <option value="all">All Types</option>
                <option value="general">General Inquiry</option>
                <option value="support">Support Request</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </div>

          {/* Active Filters Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {statusFilter !== "all" && (
              <Badge className="bg-blue-100 text-blue-800">
                Status: {statusFilter}
              </Badge>
            )}
            {typeFilter !== "all" && (
              <Badge className="bg-purple-100 text-purple-800">
                Type: {typeFilter}
              </Badge>
            )}
            {searchTerm && (
              <Badge className="bg-amber-100 text-amber-800">
                Search: "{searchTerm}"
              </Badge>
            )}
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 pb-20 flex-1">
        {loading ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-500 mx-auto"></div>
            <p className="text-lg text-slate-600 mt-6 font-medium">Loading messages...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching user inquiries</p>
          </Card>
        ) : filteredMessages.length === 0 ? (
          <Card className="p-16 text-center border-slate-200/80 rounded-2xl shadow-sm bg-white/90">
            <div className="p-6 rounded-2xl bg-slate-100 inline-flex mb-6">
              <MessageSquare className="h-20 w-20 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">
              No messages found
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all"
                ? "No messages match your current filters"
                : "No contact messages have been received yet"}
            </p>
          </Card>
        ) : (
          <>
            {/* Messages Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMessages.map((message) => {
                const statusBadge = getStatusBadge(message.status);
                const typeBadge = getTypeBadge(message.inquiryType);
                const isExpanded = expandedMessages[message._id];
                const isNew = message.status === 'new';

                return (
                  <Card 
                    key={message._id} 
                    className={`rounded-2xl border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/90 backdrop-blur-sm ${
                      isNew 
                        ? 'border-blue-200/80 border-2' 
                        : 'border-slate-200/80'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {isNew && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            )}
                            <h3 className="font-bold text-lg text-slate-900 truncate">
                              {message.subject}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={`${statusBadge.bg} inline-flex items-center gap-1`}>
                              {statusBadge.icon}
                              <span>{statusBadge.label}</span>
                            </Badge>
                            <Badge className={`${typeBadge.bg} inline-flex items-center gap-1`}>
                              {typeBadge.icon}
                              <span>{typeBadge.label}</span>
                            </Badge>
                          </div>

                          {/* Sender Info */}
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 truncate">
                                {message.name}
                              </p>
                              <p className="text-sm text-slate-600 truncate">
                                {message.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Message Preview */}
                      <div className="mb-4">
                        <p className={`text-slate-700 ${isExpanded ? '' : 'line-clamp-3'}`}>
                          {message.message}
                        </p>
                        {message.message.length > 150 && (
                          <button
                            onClick={() => toggleMessageExpand(message._id)}
                            className="mt-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-4 w-4" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-4 w-4" />
                                Read more
                              </>
                            )}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-200/60">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">{getTimeAgo(message.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {message.subscribe && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Subscribed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6 grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(message)}
                        className="border-slate-300 hover:border-slate-400 hover:bg-slate-50"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleReply(message)}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
                <div className="text-sm text-slate-600">
                  Showing <span className="font-semibold text-slate-900">
                    {(currentPage - 1) * 10 + 1}
                  </span> to{" "}
                  <span className="font-semibold text-slate-900">
                    {Math.min(currentPage * 10, pagination?.total || 0)}
                  </span> of{" "}
                  <span className="font-semibold text-slate-900">{pagination?.total || 0}</span> messages
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1 mx-4">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === pageNum
                              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                              : "text-slate-700 hover:bg-slate-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border-slate-300 hover:border-slate-400 disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Details Modal */}
      <Dialog open={detailsModalOpen} onOpenChange={setDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>Message Details</DialogTitle>
                    <DialogDescription>
                      Complete information about this inquiry
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusBadge(selectedMessage.status).bg}>
                      {selectedMessage.status.toUpperCase()}
                    </Badge>
                    <Badge className={getTypeBadge(selectedMessage.inquiryType).bg}>
                      {selectedMessage.inquiryType.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <DialogBody>
                <div className="space-y-6">
                  {/* Sender Information */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Sender Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Name</p>
                          <p className="font-semibold text-slate-900">{selectedMessage.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="font-semibold text-slate-900">{selectedMessage.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Content */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
                      Message Content
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-lg">{selectedMessage.subject}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                        <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Inquiry Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Type</span>
                          <Badge className={getTypeBadge(selectedMessage.inquiryType).bg}>
                            {getTypeBadge(selectedMessage.inquiryType).label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Status</span>
                          <Badge className={getStatusBadge(selectedMessage.status).bg}>
                            {selectedMessage.status.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Newsletter</span>
                          <Badge className={selectedMessage.subscribe ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}>
                            {selectedMessage.subscribe ? "Subscribed" : "Not Subscribed"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60">
                      <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-2">
                        Timeline
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Submitted</p>
                            <p className="font-semibold text-slate-900">{formatDate(selectedMessage.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <div>
                            <p className="text-xs text-slate-500">Time ago</p>
                            <p className="font-semibold text-slate-900">{getTimeAgo(selectedMessage.createdAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogBody>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleDelete(selectedMessage)}
                  className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:border-rose-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleArchive(selectedMessage)}
                  className="border-slate-300 hover:border-slate-400"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Archive
                </Button>
                <Button
                  onClick={() => {
                    setDetailsModalOpen(false);
                    handleReply(selectedMessage);
                  }}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Reply via Email
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};