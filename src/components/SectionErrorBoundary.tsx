"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  sectionName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * SectionErrorBoundary
 * Intent: Isolate runtime rendering crashes within a specific section so the remainder
 * of the page stays fully operational and interactive for visitors.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log intent: Record non-blocking section failures for diagnostics without revealing secrets
    console.error(`Error in section [${this.props.sectionName || "unnamed"}]:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto my-6 max-w-4xl rounded-xl border border-[#FF6700]/30 bg-[#FF6700]/10 p-6 text-center text-slate-800">
          <AlertTriangle className="mx-auto h-6 w-6 text-[#FF6700]" />
          <h3 className="mt-2 text-sm font-semibold">
            {this.props.sectionName || "Section"} temporarily unavailable
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            This module encountered an issue while loading. The rest of the site remains fully accessible.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

