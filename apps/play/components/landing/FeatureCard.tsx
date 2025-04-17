"use client";

import React from "react";
import { motion } from "framer-motion";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
}) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="flex flex-col items-start rounded-xl border border-black/90 bg-black p-6 backdrop-blur-lg"
    >
      <div className="mb-4 rounded-lg bg-gradient-to-br from-amber-700 to-amber-400 p-3">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-neutral-300">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
