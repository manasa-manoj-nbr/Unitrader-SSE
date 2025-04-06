import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import cn from 'classnames'
import Layout from '../components/Layout'
import Image from '../components/Image'
import { getAllDataByType } from '../lib/cosmic'
import ItemPurchaseTracker from '../components/item_adder'

import styles from '../styles/pages/NotFound.module.sass'

const NotFound = ({ navigationItems }) => {
  const { push } = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [pulseEffect, setPulseEffect] = useState(false)

  // Animation on component mount
  useEffect(() => {
    setIsLoaded(true)

    // Set up pulsing animation interval
    const pulseInterval = setInterval(() => {
      setPulseEffect(prev => !prev)
    }, 3000)

    return () => clearInterval(pulseInterval)
  }, [])

  const handleClick = href => {
    push(href)
  }

  return (
    <Layout navigationPaths={navigationItems[0]?.metadata}>
      <ItemPurchaseTracker />
      <div className={cn('section', styles.section)}>
        <div
          className={cn('container', styles.container)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className={styles.wrap}>
            {/* Premium card container */}
            <div
              style={{
                boxShadow:
                  '0 15px 35px rgba(0, 0, 0, 0.1), 0 3px 10px rgba(0, 0, 0, 0.05)',
                borderRadius: '24px',
                overflow: 'hidden',
                maxWidth: '550px',
                margin: '0 auto',
                backgroundColor: '#fff',
                position: 'relative',
                transition: 'box-shadow 0.5s ease',
              }}
            >
              {/* Animated gradient border */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: '24px',
                  padding: '2px',
                  background:
                    'linear-gradient(45deg, #3b82f6, #10b981, #3b82f6)',
                  backgroundSize: '200% 200%',
                  animation: 'gradientAnimation 6s ease infinite',
                  zIndex: -1,
                }}
              />

              {/* Title bar with animated icon */}
              <div
                style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(to right, #f8f9fa, #f0f4f8)',
                  borderBottom: '1px solid #eaeaea',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: pulseEffect ? 'pulse 1.5s ease' : 'none',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M12 8v4" />
                    <path d="M12 16h.01" />
                  </svg>
                </div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    background: 'linear-gradient(45deg, #334155, #1e293b)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 1px 1px rgba(0,0,0,0.05)',
                  }}
                >
                  Secure Transaction Verification
                </h2>
              </div>

              {/* QR code container with animations */}
              <div
                style={{
                  padding: '2.5rem 2rem',
                  position: 'relative',
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  perspective: '1000px',
                }}
              >
                <a
                  href="/images/content/qr.png"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    position: 'relative',
                    maxWidth: '300px',
                    margin: '0 auto',
                    transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                    transform: 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform =
                      'rotateY(5deg) scale(1.03)'
                    e.currentTarget.style.boxShadow =
                      '0 20px 30px rgba(0, 0, 0, 0.15)'
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = 'rotateY(0deg) scale(1)'
                    e.currentTarget.style.boxShadow =
                      '0 8px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #eaeaea',
                      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.5s ease',
                    }}
                  >
                    {/* Loading animation wrapper */}
                    <div
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Shimmer effect */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                          animation: 'shimmer 1.8s infinite',
                          zIndex: 2,
                        }}
                      />

                      <Image
                        size={{
                          width: '100%',
                          height: 'auto',
                          aspectRatio: '1/1',
                        }}
                        src="/images/content/qr_blur.png"
                        srcDark="/images/content/qr_blur.png"
                        alt="QR Code"
                      />
                    </div>

                    {/* Interactive overlay */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0.9,
                        transition: 'opacity 0.4s ease',
                      }}
                    >
                      <div
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderRadius: '12px',
                          padding: '0.75rem 1.25rem',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(0)',
                          transition:
                            'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                          border: '1px solid rgba(255,255,255,0.3)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                            <polyline points="10 17 15 12 10 7" />
                            <line x1="15" y1="12" x2="3" y2="12" />
                          </svg>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: '600',
                              color: '#334155',
                              fontSize: '0.95rem',
                            }}
                          >
                            Click to reveal code
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>

                {/* Scanning animation */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '300px',
                    height: '2px',
                    backgroundColor: 'rgba(59, 130, 246, 0.7)',
                    boxShadow:
                      '0 0 10px rgba(59, 130, 246, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)',
                    animation: 'scanAnimation 2s ease-in-out infinite',
                    zIndex: 3,
                  }}
                />
              </div>

              {/* Instructions area with animated icon */}
              <div
                style={{
                  padding: '1.5rem',
                  borderTop: '1px solid #eaeaea',
                  background: 'linear-gradient(to right, #f8f9fa, #f0f4f8)',
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <p
                  style={{
                    margin: 0,
                    fontSize: '1rem',
                    color: '#475569',
                    fontWeight: '500',
                  }}
                >
                  Present this QR code to verify your transaction
                </p>
              </div>
            </div>

            {/* Animated security badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '1.5rem auto 0',
                maxWidth: '500px',
                padding: '0.75rem 1.25rem',
                backgroundColor: '#f0f7ff',
                borderRadius: '12px',
                color: '#2563eb',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
                opacity: isLoaded ? 1 : 0,
                transition: 'all 0.8s ease 0.3s',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: pulseEffect
                      ? 'pulseEffect 1.5s ease-in-out'
                      : 'none',
                  }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="M9 12l2 2 4-4"></path>
                </svg>
                <span style={{ fontWeight: '500' }}>
                  Verified by Secure Transaction System
                </span>
              </div>
            </div>

            {/* Add timestamp with animated dots */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '1.25rem auto 0',
                opacity: isLoaded ? 0.8 : 0,
                transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.8s ease 0.5s',
              }}
            >
              <div
                style={{
                  fontSize: '0.875rem',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Valid for: 10:00
                <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{ animation: 'fadeInOut 1.5s infinite' }}>
                    .
                  </span>
                  <span style={{ animation: 'fadeInOut 1.5s infinite 0.5s' }}>
                    .
                  </span>
                  <span style={{ animation: 'fadeInOut 1.5s infinite 1s' }}>
                    .
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scanAnimation {
          0% {
            top: 15%;
            opacity: 0.9;
          }
          50% {
            top: 85%;
            opacity: 0.6;
          }
          100% {
            top: 15%;
            opacity: 0.9;
          }
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.3;
          }
        }

        @keyframes pulseEffect {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </Layout>
  )
}

export default NotFound

export async function getStaticProps() {
  const navigationItems = (await getAllDataByType('navigation')) || []

  return {
    props: { navigationItems },
  }
}
