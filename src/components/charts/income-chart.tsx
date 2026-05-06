"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { formatCurrency } from "@/lib/format";

export function IncomeChart({ data }: { data: Array<{ month: string; ingresos: number }> }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorIngresos" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(127,127,127,0.14)" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} />
          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          <Area type="monotone" dataKey="ingresos" stroke="var(--primary)" fillOpacity={1} fill="url(#colorIngresos)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
