"use client";

import ConfirmActionModal from "./ConfirmActionModal";

interface RemoveReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function RemoveReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: RemoveReviewModalProps) {
  return (
    <ConfirmActionModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Remove Review"
      message="Are you sure you want to remove this review? This action will remove the review from the platform."
      confirmText="Remove Review"
      cancelText="Dismiss"
      isDanger={true}
      isLoading={isLoading}
    />
  );
}
