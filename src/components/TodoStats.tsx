import { Card } from '@/components/ui/card';
import { CheckCircle2, Circle, TrendingUp } from 'lucide-react';

interface TodoStatsProps {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
}

export function TodoStats({ totalTodos, completedTodos, pendingTodos }: TodoStatsProps) {
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-muted/20 flex items-center justify-center">
            <Circle className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-foreground">{pendingTodos}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success-muted/20 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-foreground">{completedTodos}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}