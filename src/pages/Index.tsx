import { Button } from "@/components/ui/button";
import { Shield, Lock, MapPin, Activity, AlertTriangle, Eye } from "lucide-react";
import { SecurityBadge } from "@/components/SecurityBadge";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-cyber bg-clip-text text-transparent">
              SecureAuth
            </span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <Button onClick={() => navigate("/dashboard")} className="bg-gradient-primary">
                Dashboard
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} className="bg-gradient-primary">
                Đăng nhập
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse bg-primary/20 rounded-full blur-3xl" />
              <Shield className="w-24 h-24 text-primary relative animate-float" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-transparent">
            Bảo mật nâng cao
            <br />
            với AI & IP Tracking
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Hệ thống bảo mật toàn diện với theo dõi IP, phân tích rủi ro, 
            và giám sát hành vi người dùng theo thời gian thực.
          </p>

          <SecurityBadge />

          <div className="flex gap-4 justify-center mt-12">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary text-lg px-8 shadow-primary hover:shadow-glow transition-all duration-300"
            >
              Bắt đầu ngay
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 border-primary/50 hover:border-primary hover:bg-primary/10"
            >
              Tìm hiểu thêm
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-primary bg-clip-text text-transparent">
            Tính năng nổi bật
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={MapPin}
              title="Theo dõi IP & Vị trí"
              description="Xác định vị trí đăng nhập chính xác với IP Geolocation API, phát hiện đăng nhập từ vị trí bất thường"
              color="primary"
            />
            <FeatureCard
              icon={Activity}
              title="Phân tích Rủi ro"
              description="AI đánh giá độ tin cậy mỗi lần đăng nhập dựa trên IP, thiết bị, thời gian và hành vi"
              color="secondary"
            />
            <FeatureCard
              icon={AlertTriangle}
              title="Cảnh báo Thời gian thực"
              description="Nhận thông báo ngay lập tức khi phát hiện hành vi đáng ngờ hoặc đăng nhập từ vị trí lạ"
              color="warning"
            />
            <FeatureCard
              icon={Lock}
              title="Mã hóa & Xác thực"
              description="Bảo mật tối đa với bcrypt hashing, 2FA/MFA và HTTPS/TLS encryption"
              color="primary"
            />
            <FeatureCard
              icon={Eye}
              title="Giám sát Bất thường"
              description="Machine Learning phát hiện hành vi đăng nhập bất thường và giả mạo"
              color="accent"
            />
            <FeatureCard
              icon={Shield}
              title="Quản lý Phiên"
              description="Xem và kiểm soát tất cả thiết bị đang đăng nhập, đăng xuất khỏi thiết bị lạ"
              color="secondary"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-primary p-12 rounded-3xl shadow-glow">
            <h2 className="text-4xl font-bold text-white mb-6">
              Sẵn sàng bảo vệ tài khoản của bạn?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Bắt đầu với hệ thống bảo mật nâng cao ngay hôm nay
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary hover:bg-white/90 text-lg px-12 shadow-lg"
            >
              Đăng ký miễn phí
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/50 bg-background/50">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 SecureAuth. Bảo mật nâng cao với công nghệ AI.</p>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  color: string;
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    warning: "text-warning bg-warning/10 border-warning/20",
    accent: "text-accent bg-accent/10 border-accent/20",
  };

  return (
    <div className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-card transition-all duration-300">
      <div className={`w-16 h-16 rounded-2xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-2xl font-bold mb-4 text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

export default Index;
