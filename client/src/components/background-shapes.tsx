export default function BackgroundShapes({ variant = "default" }: { variant?: "default" | "hero" | "tools" }) {
  if (variant === "hero") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-20 -right-40 w-96 h-96 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 25%, #f8b500 50%, #3c6382 75%, #40407a 100%)",
            opacity: 0.4,
            filter: "blur(2px)",
            animationDelay: "0s"
          }}
        ></div>
        <div 
          className="absolute bottom-20 -left-32 w-80 h-80 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 25%, #43e97b 50%, #667eea 75%, #764ba2 100%)",
            opacity: 0.5,
            filter: "blur(2px)",
            animationDelay: "3s"
          }}
        ></div>
        <div 
          className="absolute top-1/3 left-1/4 w-32 h-32 rounded-2xl transform rotate-45 floating-element"
          style={{
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fad0c4 100%)",
            opacity: 0.6,
            filter: "blur(1px)",
            animationDelay: "1.5s"
          }}
        ></div>
        <div 
          className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff8a80 100%)",
            opacity: 0.7,
            filter: "blur(1px)",
            animationDelay: "4s"
          }}
        ></div>
        <div 
          className="absolute top-1/2 right-1/4 w-40 h-16 rounded-full transform rotate-12 floating-element"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            opacity: 0.5,
            filter: "blur(2px)",
            animationDelay: "2s"
          }}
        ></div>
        <div 
          className="absolute bottom-1/4 left-1/3 w-28 h-28 rounded-xl transform -rotate-12 floating-element"
          style={{
            background: "linear-gradient(135deg, #a8e6cf 0%, #dcedc1 50%, #ffd3a5 100%)",
            opacity: 0.6,
            filter: "blur(1px)",
            animationDelay: "5s"
          }}
        ></div>
        
        {/* Additional floating geometric shapes */}
        <div 
          className="absolute w-20 h-20 top-1/4 left-1/2 floating-element"
          style={{
            background: "linear-gradient(45deg, #ff6b9d, #c44569)",
            clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            opacity: 0.6,
            animationDelay: "2s"
          }}
        />
        <div 
          className="absolute w-16 h-16 bottom-1/3 right-1/3 floating-element"
          style={{
            background: "linear-gradient(45deg, #4facfe, #00f2fe)",
            borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
            opacity: 0.7,
            animationDelay: "6s"
          }}
        />
      </div>
    );
  }

  if (variant === "tools") {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-40 right-10 w-64 h-64 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 50%, #43e97b 100%)",
            opacity: 0.4,
            filter: "blur(2px)",
            animationDelay: "0s"
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-20 w-48 h-48 rounded-2xl transform rotate-12 floating-element"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
            opacity: 0.5,
            filter: "blur(1px)",
            animationDelay: "2s"
          }}
        ></div>
        <div 
          className="absolute top-60 left-1/3 w-32 h-32 rounded-full floating-element"
          style={{
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fad0c4 100%)",
            opacity: 0.6,
            filter: "blur(1px)",
            animationDelay: "4s"
          }}
        ></div>
        <div 
          className="absolute bottom-40 right-1/3 w-24 h-56 rounded-full transform rotate-45 floating-element"
          style={{
            background: "linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #f8b500 100%)",
            opacity: 0.5,
            filter: "blur(2px)",
            animationDelay: "1s"
          }}
        ></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute top-20 right-20 w-72 h-72 rounded-full floating-element"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
          opacity: 0.4,
          filter: "blur(2px)",
          animationDelay: "0s"
        }}
      ></div>
      <div 
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full floating-element"
        style={{
          background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #fad0c4 100%)",
          opacity: 0.5,
          filter: "blur(1px)",
          animationDelay: "3s"
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 w-40 h-40 rounded-2xl transform rotate-45 floating-element"
        style={{
          background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff8a80 100%)",
          opacity: 0.6,
          filter: "blur(1px)",
          animationDelay: "1.5s"
        }}
      ></div>
    </div>
  );
}
