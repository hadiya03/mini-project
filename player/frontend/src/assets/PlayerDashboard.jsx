import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity, Brain, AlertTriangle, Clock, Moon, Heart,
  Zap, Lightbulb, User, Shield, Pencil, Check, Camera,
  FileDown, MessageSquare, Info
} from "lucide-react";

export default function PlayerDashboard() {
  const [readiness, setReadiness] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [player, setPlayer] = useState({
    name: "Alex Johnson",
    position: "Forward",
    team: "Elite Strikers FC",
    number: "09",
    status: "Active",
    image: ""
  });
  const [form, setForm] = useState({
    rpe: "",
    sleep: "",
    soreness: "",
    tiredness: ""
  });
  const [submissions, setSubmissions] = useState([]);
  const [trainerMessages, setTrainerMessages] = useState([]);

  const handleProfileChange = (field, value) => {
    setPlayer(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPlayer(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const handleInputChange = (field, value) => {
    // Validate input based on field limits
    let maxValue;
    if (field === 'sleep') {
      maxValue = 24; // Maximum 24 hours of sleep
    } else {
      maxValue = 10; // RPE, soreness, and tiredness max is 10
    }

    // Only allow positive numbers and enforce max limit
    const numValue = parseFloat(value);
    if (value === "" || (numValue >= 0 && numValue <= maxValue)) {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    const isFormComplete = Object.values(form).every(value => value.trim() !== "");
    if (!isFormComplete) {
      alert("Please fill in all details before submitting.");
      return;
    }

    const sleepWeight = (parseInt(form.sleep) / 10) * 100;
    const fatigueWeight = (10 - parseInt(form.tiredness)) * 10;
    const calculatedScore = Math.min(100, Math.round((sleepWeight + fatigueWeight) / 2));
    
    setReadiness(calculatedScore);

    const newEntry = {
      date: new Date().toLocaleString(),
      rpe: ${form.rpe}/10,
      tiredness: ${form.tiredness}/10,
      sleep: ${form.sleep}h,
      soreness: ${form.soreness}/10,
      readiness: ${calculatedScore}%
    };

    setSubmissions([newEntry, ...submissions]);
    setForm({ rpe: "", sleep: "", soreness: "", tiredness: "" });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const metrics = [
    { label: "RPE", value: form.rpe ? ${form.rpe}/10 : "No data", icon: <Activity className="w-5 h-5 text-blue-600" /> },
    { label: "Tiredness", value: form.tiredness ? ${form.tiredness}/10 : "No data", icon: <Zap className="w-5 h-5 text-amber-600" /> },
    { label: "Injury Risk", value: submissions.length > 0 ? "Low" : "No data", icon: <AlertTriangle className="w-5 h-5 text-red-600" /> },
    { label: "Sleep", value: form.sleep ? ${form.sleep}h : "No data", icon: <Moon className="w-5 h-5 text-indigo-600" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-blue-600 shadow-lg">
                  <AvatarImage src={player.image} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-2xl font-bold">
                    {player.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input value={player.name} onChange={(e) => handleProfileChange('name', e.target.value)} placeholder="Name" className="bg-slate-50 border-slate-300 text-slate-900" />
                    <Input value={player.position} onChange={(e) => handleProfileChange('position', e.target.value)} placeholder="Position" className="bg-slate-50 border-slate-300 text-slate-900" />
                    <Input value={player.team} onChange={(e) => handleProfileChange('team', e.target.value)} placeholder="Team" className="bg-slate-50 border-slate-300 text-slate-900" />
                    <Input value={player.number} onChange={(e) => handleProfileChange('number', e.target.value)} placeholder="Number" className="bg-slate-50 border-slate-300 text-slate-900" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-slate-900">{player.name}</h1>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">{player.status}</span>
                    </div>
                    <p className="text-slate-600 flex items-center gap-2 flex-wrap">
                      <Shield className="w-4 h-4" /> {player.team}
                      <span className="text-slate-400">•</span>
                      <User className="w-4 h-4" /> {player.position}
                      <span className="text-slate-400">•</span>
                      #{player.number}
                    </p>
                  </>
                )}
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <Button onClick={handleDownloadPDF} variant="outline" className="flex-1 md:flex-none bg-white border-slate-300 hover:bg-slate-50 text-slate-700">
                  <FileDown className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button onClick={() => setIsEditing(!isEditing)} className="bg-blue-600 border-blue-700 hover:bg-blue-700 text-white md:flex-none">
                  {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Pencil className="w-4 h-4 mr-2" />}
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Brain className="w-5 h-5 text-blue-600" />
                Daily Readiness Score
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center justify-center py-8">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full border-8 border-slate-200 flex items-center justify-center">
                    <span className="text-5xl font-bold text-slate-900">
                      {readiness !== null ? readiness : "--"}
                    </span>
                    <span className="text-2xl text-slate-600 ml-1">%</span>
                  </div>
                </div>
              </div>
              <Progress value={readiness || 0} className="h-3 bg-slate-200" />
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                Trainer Feedback
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 max-h-64 overflow-y-auto">
              <div className="space-y-3">
                {trainerMessages.length > 0 ? (
                  trainerMessages.map((msg) => (
                    <div key={msg.time} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm text-slate-900">{msg.sender}</span>
                        <span className="text-xs text-slate-500">{msg.time}</span>
                      </div>
                      <p className="text-sm text-slate-700">{msg.text}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    No feedback from trainer yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {metrics.map((m, i) => (
            <Card key={i} className="bg-white border-slate-200 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {m.icon}
                  <div>
                    <p className="text-sm text-slate-600">{m.label}</p>
                    <p className="text-xl font-bold text-slate-900">{m.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Post-Training Input
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">RPE (1-10)</label>
                <Input
                  placeholder="Rate of Perceived Exertion"
                  value={form.rpe}
                  onChange={(e) => handleInputChange('rpe', e.target.value)}
                  type="number"
                  min="0"
                  max="10"
                  className="bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sleep (0-24 hours)</label>
                <Input
                  placeholder="Hours of sleep"
                  value={form.sleep}
                  onChange={(e) => handleInputChange('sleep', e.target.value)}
                  type="number"
                  min="0"
                  max="24"
                  className="bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Soreness (1-10)</label>
                <Input
                  placeholder="Muscle soreness level"
                  value={form.soreness}
                  onChange={(e) => handleInputChange('soreness', e.target.value)}
                  type="number"
                  min="0"
                  max="10"
                  className="bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Tiredness (1-10)</label>
                <Input
                  placeholder="Mental/physical tiredness"
                  value={form.tiredness}
                  onChange={(e) => handleInputChange('tiredness', e.target.value)}
                  type="number"
                  min="0"
                  max="10"
                  className="bg-slate-50 border-slate-300 text-slate-900"
                />
              </div>
            </div>
            <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Check className="w-4 h-4 mr-2" />
              Submit Training Data
            </Button>
          </CardContent>
        </Card>

        {submissions.length > 0 && (
          <Card className="bg-white border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="flex items-center gap-2 text-slate-900">
                <Clock className="w-5 h-5 text-blue-600" />
                Training History
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200">
                    <TableHead className="text-slate-700">Date</TableHead>
                    <TableHead className="text-slate-700">RPE</TableHead>
                    <TableHead className="text-slate-700">Tiredness</TableHead>
                    <TableHead className="text-slate-700">Sleep</TableHead>
                    <TableHead className="text-slate-700">Soreness</TableHead>
                    <TableHead className="text-slate-700">Readiness</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((entry, idx) => (
                    <TableRow key={idx} className="border-slate-200">
                      <TableCell className="text-slate-900">{entry.date}</TableCell>
                      <TableCell className="text-slate-700">{entry.rpe}</TableCell>
                      <TableCell className="text-slate-700">{entry.tiredness}</TableCell>
                      <TableCell className="text-slate-700">{entry.sleep}</TableCell>
                      <TableCell className="text-slate-700">{entry.soreness}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{entry.readiness}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Accordion type="single" collapsible className="bg-white rounded-lg border border-slate-200 shadow-md">
          <AccordionItem value="info" className="border-slate-200">
            <AccordionTrigger className="px-6 hover:bg-slate-50 text-slate-900">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Metric Descriptions
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 text-slate-700">
              <ul className="space-y-2">
                <li><strong className="text-slate-900">RPE:</strong> Rate of Perceived Exertion from 1 (very light) to 10 (maximum effort).</li>
                <li><strong className="text-slate-900">Sleep:</strong> Hours rested (0-24 hours).</li>
                <li><strong className="text-slate-900">Soreness:</strong> Muscle soreness level from 1 (no soreness) to 10 (extremely sore).</li>
                <li><strong className="text-slate-900">Tiredness:</strong> Physical/Mental fatigue from 1 (fully energized) to 10 (completely exhausted).</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

      </div>
    </div>
  );
}
