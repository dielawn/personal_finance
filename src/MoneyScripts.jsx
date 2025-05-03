import React, { useState, useEffect } from 'react';
import './MoneyScripts.css';

const MoneyScripts = ({ initialData, setGoalData }) => {
  // Initialize state with initialData or default values
  const [selectedArchetypes, setSelectedArchetypes] = useState(initialData?.types || []);
  const [goals, setGoals] = useState(initialData?.goals || []);
  const [newGoal, setNewGoal] = useState('');
  const [step, setStep] = useState(1);
  const [selectedGoalIndex, setSelectedGoalIndex] = useState(0);
  const [newTask, setNewTask] = useState('');
  const [newMotivator, setNewMotivator] = useState('');
  const [taskDate, setTaskDate] = useState('');
  
  // Money archetypes data
  const archetypes = [
    {
      id: 'avoidance',
      name: 'Money Avoidance',
      description: 'Tendency to believe money is bad or that you don\'t deserve it. May sabotage financial success, avoid looking at financial statements, or give money away impulsively.'
    },
    {
      id: 'worship',
      name: 'Money Worship',
      description: 'Belief that money will solve all problems. Often caught in the pursuit of more, thinking happiness lies in the next financial achievement, yet may struggle with excessive debt and workaholism.'
    },
    {
      id: 'status',
      name: 'Money Status',
      description: 'Equating self-worth with net worth. Tendency to display wealth through status symbols and may spend excessively to maintain appearances, sometimes regardless of actual financial health.'
    },
    {
      id: 'vigilance',
      name: 'Money Vigilance',
      description: 'Characterized by alertness, watchfulness, and concern about money. While saving well and avoiding debt, might experience anxiety about finances and struggle to enjoy the benefits of financial prudence.'
    }
  ];

  // Toggle archetype selection
  const toggleArchetype = (id) => {
    console.log('Toggling archetype:', id);
    if (selectedArchetypes.includes(id)) {
      setSelectedArchetypes(selectedArchetypes.filter(type => type !== id));
    } else {
      setSelectedArchetypes([...selectedArchetypes, id]);
    }
  };

  // Add a new goal
  const addGoal = () => {
    if (newGoal.trim()) {
      console.log('Adding goal:', newGoal);
      setGoals([...goals, { 
        text: newGoal, 
        priority: goals.length + 1,
        timeframe: '',
        todos: [],
        motivators: []
      }]);
      setNewGoal('');
    }
  };

  // Handle goal priority change
  const movePriority = (index, direction) => {
    console.log('Moving priority:', index, direction);
    if (
      (direction === 'up' && index > 0) || 
      (direction === 'down' && index < goals.length - 1)
    ) {
      const newGoals = [...goals];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      
      // Swap the items
      [newGoals[index], newGoals[swapIndex]] = [newGoals[swapIndex], newGoals[index]];
      
      // Update priorities
      newGoals.forEach((goal, i) => {
        goal.priority = i + 1;
      });
      
      setGoals(newGoals);
    }
  };

  // Remove a goal
  const removeGoal = (index) => {
    console.log('Removing goal at index:', index);
    const newGoals = goals.filter((_, i) => i !== index);
    // Update priorities
    newGoals.forEach((goal, i) => {
      goal.priority = i + 1;
    });
    setGoals(newGoals);
  };

  // Save data
  const saveData = () => {
    console.log('Saving data:', { types: selectedArchetypes, goals });
    setGoalData({ types: selectedArchetypes, goals });
  };

  // Handle enter key in goal input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addGoal();
    }
  };

  // Move to next step
  const nextStep = () => {
    console.log('Moving to next step');
    setStep(step + 1);
    
    // Reset selected goal index when moving to step 4 or 5
    if (step === 3 || step === 4) {
      setSelectedGoalIndex(0);
    }
  };

  // Move to previous step
  const prevStep = () => {
    console.log('Moving to previous step');
    setStep(step - 1);
  };

  return (
    <div className="money-scripts-container">
      <h2>Money Scripts Assessment</h2>
      
      {step === 1 && (
        <div className="step-container">
          <h3>Step 1: Identify Your Money Archetypes</h3>
          <p>Select the money archetypes that you feel describe your relationship with money:</p>
          
          <div className="archetypes-grid">
            {archetypes.map(archetype => (
              <div 
                key={archetype.id} 
                className={`archetype-card ${selectedArchetypes.includes(archetype.id) ? 'selected' : ''}`}
                onClick={() => toggleArchetype(archetype.id)}
              >
                <h4>{archetype.name}</h4>
                <p>{archetype.description}</p>
              </div>
            ))}
          </div>
          
          <div className="learn-more">
            <a href="https://www.yourmentalwealthadvisors.com/our-process/your-money-script/" target="_blank" rel="noopener noreferrer">
              Learn more about Money Scripts
            </a>
          </div>
          
          <div className="button-container">
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={selectedArchetypes.length === 0}
            >
              Next: Define Your Goals
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="step-container">
          <h3>Step 2: Define Your Life Goals</h3>
          <p className="goal-prompt">
            What would it be like to live your best, most fulfilled life? 
            <br />(Write down anything that comes to mind. Keep asking, "Anything else?")
          </p>
          
          <div className="goal-input-container">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a goal..."
              className="goal-input"
            />
            <button onClick={addGoal} className="add-goal-button">Add Goal</button>
          </div>
          
          {goals.length > 0 && (
            <div className="goals-list">
              <h4>Your Goals:</h4>
              {goals.map((goal, index) => (
                <div key={index} className="goal-item">
                  <span className="goal-priority">#{goal.priority}</span>
                  <span className="goal-text">{goal.text}</span>
                  <div className="goal-actions">
                    <button 
                      onClick={() => movePriority(index, 'up')}
                      disabled={index === 0}
                      className="priority-button"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => movePriority(index, 'down')}
                      disabled={index === goals.length - 1}
                      className="priority-button"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => removeGoal(index)}
                      className="remove-button"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="button-container">
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={goals.length === 0}
            >
              Next: Review & Save
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="step-container">
          <h3>Step 3: Set Timeframes for Top Goals</h3>
          
          {goals.length > 0 && goals.slice(0, 3).map((goal, index) => (
            <div key={index} className="timeframe-container">
              <h4>Goal #{goal.priority}: {goal.text}</h4>
              <div className="timeframe-input">
                <label>When would you like to accomplish this goal?</label>
                <input 
                  type="text" 
                  placeholder="e.g., 6 months, 1 year, by 2026..."
                  value={goal.timeframe || ''}
                  onChange={(e) => {
                    const updatedGoals = [...goals];
                    updatedGoals[index].timeframe = e.target.value;
                    setGoals(updatedGoals);
                    console.log('Set timeframe for goal:', index, e.target.value);
                  }}
                />
              </div>
            </div>
          ))}
          
          <div className="button-container">
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={goals.slice(0, 3).some(goal => !goal.timeframe)}
            >
              Next: Define Action Steps
            </button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="step-container">
          <h3>Step 4: Action Steps</h3>
          
          <div className="goal-selector">
            <label>Select a goal to add tasks:</label>
            <select 
              value={selectedGoalIndex} 
              onChange={(e) => setSelectedGoalIndex(parseInt(e.target.value))}
            >
              {goals.slice(0, 3).map((goal, index) => (
                <option key={index} value={index}>
                  Goal #{goal.priority}: {goal.text}
                </option>
              ))}
            </select>
          </div>
          
          <div className="selected-goal">
            <h4>{goals[selectedGoalIndex]?.text}</h4>
            <p>Timeframe: {goals[selectedGoalIndex]?.timeframe}</p>
            
            <div className="task-input-container">
              <div className="task-input-row">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="What task will move you toward this goal?"
                  className="task-input"
                />
                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="date-input"
                />
              </div>
              <button 
                onClick={() => {
                  if (newTask.trim()) {
                    const updatedGoals = [...goals];
                    if (!updatedGoals[selectedGoalIndex].todos) {
                      updatedGoals[selectedGoalIndex].todos = [];
                    }
                    updatedGoals[selectedGoalIndex].todos.push({
                      task: newTask,
                      date: taskDate
                    });
                    setGoals(updatedGoals);
                    setNewTask('');
                    setTaskDate('');
                    console.log('Added task to goal:', selectedGoalIndex, newTask, taskDate);
                  }
                }} 
                className="add-task-button"
              >
                Add Task
              </button>
            </div>
            
            {goals[selectedGoalIndex]?.todos && goals[selectedGoalIndex].todos.length > 0 && (
              <div className="tasks-list">
                <h5>Tasks for this goal:</h5>
                {goals[selectedGoalIndex].todos.map((todo, idx) => (
                  <div key={idx} className="task-item">
                    <span className="task-text">{todo.task}</span>
                    <span className="task-date">{todo.date}</span>
                    <button 
                      onClick={() => {
                        const updatedGoals = [...goals];
                        updatedGoals[selectedGoalIndex].todos = updatedGoals[selectedGoalIndex].todos.filter((_, i) => i !== idx);
                        setGoals(updatedGoals);
                        console.log('Removed task:', idx);
                      }}
                      className="remove-task-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="button-container">
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={goals.slice(0, 3).some(goal => !goal.todos || goal.todos.length === 0)}
            >
              Next: Add Motivators
            </button>
          </div>
        </div>
      )}
      
      {step === 5 && (
        <div className="step-container">
          <h3>Step 5: What Will Motivate You?</h3>
          
          <div className="goal-selector">
            <label>Select a goal to add motivators:</label>
            <select 
              value={selectedGoalIndex} 
              onChange={(e) => setSelectedGoalIndex(parseInt(e.target.value))}
            >
              {goals.slice(0, 3).map((goal, index) => (
                <option key={index} value={index}>
                  Goal #{goal.priority}: {goal.text}
                </option>
              ))}
            </select>
          </div>
          
          <div className="selected-goal">
            <h4>{goals[selectedGoalIndex]?.text}</h4>
            
            <p className="motivator-prompt">
              What will help you stay motivated when working toward this goal? 
              (Think about rewards, reminders, or supports that will reignite your energy along the way)
            </p>
            
            <div className="motivator-input-container">
              <input
                type="text"
                value={newMotivator}
                onChange={(e) => setNewMotivator(e.target.value)}
                placeholder="Enter a motivator..."
                className="motivator-input"
              />
              <button 
                onClick={() => {
                  if (newMotivator.trim()) {
                    const updatedGoals = [...goals];
                    if (!updatedGoals[selectedGoalIndex].motivators) {
                      updatedGoals[selectedGoalIndex].motivators = [];
                    }
                    updatedGoals[selectedGoalIndex].motivators.push(newMotivator);
                    setGoals(updatedGoals);
                    setNewMotivator('');
                    console.log('Added motivator to goal:', selectedGoalIndex, newMotivator);
                  }
                }} 
                className="add-motivator-button"
              >
                Add Motivator
              </button>
            </div>
            
            {goals[selectedGoalIndex]?.motivators && goals[selectedGoalIndex].motivators.length > 0 && (
              <div className="motivators-list">
                <h5>Motivators for this goal:</h5>
                {goals[selectedGoalIndex].motivators.map((motivator, idx) => (
                  <div key={idx} className="motivator-item">
                    <span>{motivator}</span>
                    <button 
                      onClick={() => {
                        const updatedGoals = [...goals];
                        updatedGoals[selectedGoalIndex].motivators = updatedGoals[selectedGoalIndex].motivators.filter((_, i) => i !== idx);
                        setGoals(updatedGoals);
                        console.log('Removed motivator:', idx);
                      }}
                      className="remove-motivator-button"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="button-container">
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
            <button 
              className="next-button" 
              onClick={nextStep}
              disabled={goals.slice(0, 3).some(goal => !goal.motivators || goal.motivators.length === 0)}
            >
              Next: Review & Save
            </button>
          </div>
        </div>
      )}
      
      {step === 6 && (
        <div className="step-container">
          <h3>Step 6: Review & Save</h3>
          
          <div className="summary-section">
            <h4>Your Money Archetypes:</h4>
            <ul className="summary-list">
              {selectedArchetypes.map(typeId => (
                <li key={typeId}>
                  {archetypes.find(a => a.id === typeId).name}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="summary-section">
            <h4>Your Prioritized Goals:</h4>
            <ol className="summary-list">
              {goals.map((goal, index) => (
                <li key={index}>
                  <strong>{goal.text}</strong>
                  {index < 3 && (
                    <div className="goal-details">
                      <p><em>Timeframe:</em> {goal.timeframe}</p>
                      
                      {goal.todos && goal.todos.length > 0 && (
                        <div>
                          <p><em>Action Steps:</em></p>
                          <ul>
                            {goal.todos.map((todo, idx) => (
                              <li key={idx}>
                                {todo.task} {todo.date ? `(by ${todo.date})` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {goal.motivators && goal.motivators.length > 0 && (
                        <div>
                          <p><em>Motivators:</em></p>
                          <ul>
                            {goal.motivators.map((motivator, idx) => (
                              <li key={idx}>{motivator}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>
          
          <div className="button-container">
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
            <button className="save-button" onClick={saveData}>
              Save Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoneyScripts;