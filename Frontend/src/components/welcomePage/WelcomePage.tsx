import ForumIcon from "@mui/icons-material/Forum";
import React, { useEffect, useState, useRef } from "react";
import {UserDTO} from "../../redux/auth/AuthModel";
import styles from './WelcomePage.module.scss';

interface WelcomePageProps {
    reqUser: UserDTO | null;
}

const WelcomePage = (props: WelcomePageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // Handle null canvas reference
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        // Handle missing context
        if (!ctx) return;
    
        // Add type annotations to function parameters
        const drawBlurredCircle = (x: number, y: number, radius: number) => {
            const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, 'rgba(40, 167, 69, 0.8)');
            gradient.addColorStop(1, 'rgba(40, 167, 69, 0)');
            
            ctx.save(); // Save current context state
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.filter = 'blur(50px)';
            ctx.fill();
            ctx.restore(); // Restore original state (removes filter)
        };
    
        const renderCircles = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            // Set canvas dimensions (this automatically clears the canvas)
            canvas.width = width;
            canvas.height = height;
            
            // Draw new circles
            for (let i = 0; i < 5; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const radius = 100 + Math.random() * 200;
                drawBlurredCircle(x, y, radius);
            }
        };
    
        const handleResize = () => {
            renderCircles();
        };
    
        // Initial render
        renderCircles();
    
        // Setup resize handler
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={styles.welcomeContainer}>
            <canvas 
                ref={canvasRef} 
                className="background-canvas"
                style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1
                }}
            />
            <div className={styles.innerWelcomeContainer}>
                <ForumIcon sx={{
                    width: '10rem',
                    height: '10rem',
                }}/>
                <h1>Welcome, {props.reqUser?.fullName}!</h1>
            </div>
        </div>
    );
};

export default WelcomePage;