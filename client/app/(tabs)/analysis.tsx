import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAnalysisStore } from '@/stores';
import type { RiskItem, KeyTerm } from '@/services';

/**
 * Analysis Tab Screen
 * Displays contract analysis loading state, progress, and results
 * Supports both direct image analysis and queue-based contract analysis
 */
export default function AnalysisScreen() {
  const {
    currentImage,
    analysisResult,
    queueResult,
    analysisStatus,
    isLoading,
    isPolling,
    progress,
    error,
    mode,
    viewSource,
    clearAnalysis,
    stopPolling,
  } = useAnalysisStore();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Helper to get the combined result (either direct or queue-based)
  const getDisplayResult = () => {
    if (mode === 'direct' && analysisResult) {
      return {
        summary: analysisResult.summary,
        riskLevel: analysisResult.riskLevel,
        risks: analysisResult.risks,
        keyTerms: analysisResult.keyTerms,
        recommendations: analysisResult.recommendations,
        contractInfo: analysisResult.contractInfo,
        analyzedAt: analysisResult.analyzedAt,
      };
    }
    if (mode === 'queue' && queueResult) {
      return {
        summary: queueResult.overviewData.summary,
        riskLevel: queueResult.overviewData.riskLevel,
        risks: queueResult.risks,
        keyTerms: queueResult.overviewData.keyTerms,
        recommendations: queueResult.suggestionsData.recommendations,
        contractInfo: queueResult.overviewData.contractInfo,
        analyzedAt: queueResult.overviewData.analyzedAt,
      };
    }
    return null;
  };

  const displayResult = getDisplayResult();

  // Loading state with progress
  if (isLoading || isPolling) {
    const statusText =
      analysisStatus?.status === 'processing' ? 'Processing Contract...' : 'Analyzing Contract...';

    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Loading Spinner */}
          <View style={styles.spinnerWrapper}>
            <View style={styles.spinnerOuter}>
              <ActivityIndicator size="large" color="#1e293b" />
            </View>
            <View style={styles.spinnerInner}>
              <Text style={styles.spinnerIcon}>📄</Text>
            </View>
          </View>
          
          <Text style={styles.loadingText}>{statusText}</Text>
          <Text style={styles.loadingSubtext}>Please wait...</Text>

          {/* Progress bar for queue-based analysis */}
          {mode === 'queue' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#1e293b', '#334155']}
                  style={[styles.progressFill, { width: `${progress}%` }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </View>
            </View>
          )}

          {/* Status info for queue-based analysis */}
          {analysisStatus && <Text style={styles.statusText}>Status: {analysisStatus.status}</Text>}
        </View>
      </View>
    );
  }

  // Error state
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>Analysis Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={clearAnalysis}>
            <Text style={styles.retryButtonText}>Back to Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Results state
  if (displayResult) {
    const getRiskLevelColor = (level: string) => {
      switch (level) {
        case 'high':
          return '#ef4444';
        case 'medium':
          return '#f59e0b';
        case 'low':
          return '#10b981';
        default:
          return '#6b7280';
      }
    };

    const getRiskLevelText = (level: string) => {
      switch (level) {
        case 'high':
          return 'High Risk';
        case 'medium':
          return 'Medium Risk';
        case 'low':
          return 'Low Risk';
        default:
          return level;
      }
    };

    const getSeverityColor = (severity: string) => {
      switch (severity) {
        case 'high':
          return '#ef4444';
        case 'medium':
          return '#f59e0b';
        case 'low':
          return '#10b981';
        default:
          return '#6b7280';
      }
    };

    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* View Source Indicator */}
          {viewSource === 'history' && (
            <View style={styles.sourceBadgeContainer}>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeIcon}>📜</Text>
                <Text style={styles.sourceBadgeText}>Historical Analysis</Text>
              </View>
            </View>
          )}

          {/* Contract Info Overview Card */}
          {displayResult.contractInfo && (
            <View style={styles.overviewCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Contract Overview</Text>
                <View style={styles.overviewBadge}>
                  <Text style={styles.overviewBadgeText}>Overview</Text>
                </View>
              </View>
              {displayResult.contractInfo.type && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Type:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.type}</Text>
                </View>
              )}
              {displayResult.contractInfo.parties &&
                displayResult.contractInfo.parties.length > 0 && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Parties:</Text>
                    <Text style={styles.infoValue}>
                      {displayResult.contractInfo.parties.join(', ')}
                    </Text>
                  </View>
                )}
              {displayResult.contractInfo.effectiveDate && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Term:</Text>
                  <Text style={styles.infoValue}>
                    {displayResult.contractInfo.effectiveDate}
                    {displayResult.contractInfo.expirationDate &&
                      ` - ${displayResult.contractInfo.expirationDate}`}
                  </Text>
                </View>
              )}
              {displayResult.contractInfo.totalValue && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Pages:</Text>
                  <Text style={styles.infoValue}>{displayResult.contractInfo.totalValue}</Text>
                </View>
              )}
            </View>
          )}

          {/* Overall Risk Level */}
          <View style={styles.riskLevelCard}>
            <View style={styles.riskLevelContent}>
              <Text style={styles.riskLevelLabel}>Overall Risk Level</Text>
              <View
                style={[
                  styles.riskLevelBadge,
                  { backgroundColor: getRiskLevelColor(displayResult.riskLevel) },
                ]}
              >
                <Text style={styles.riskLevelBadgeText}>
                  {getRiskLevelText(displayResult.riskLevel)}
                </Text>
              </View>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Summary</Text>
            </View>
            <Text style={styles.summaryText}>{displayResult.summary}</Text>
          </View>

          {/* Risk Items */}
          {displayResult.risks.length > 0 && (
            <View style={styles.riskCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Potential Risks</Text>
                <View style={styles.riskCountBadge}>
                  <Text style={styles.riskCountBadgeText}>{displayResult.risks.length} Items</Text>
                </View>
              </View>
              {displayResult.risks.map((risk: RiskItem, index: number) => (
                <View key={risk.id || index} style={styles.riskItem}>
                  <View style={styles.riskIconWrapper}>
                    <View
                      style={[
                        styles.riskIcon,
                        { backgroundColor: getSeverityColor(risk.severity || 'medium') },
                      ]}
                    >
                      <Text style={styles.riskIconText}>!</Text>
                    </View>
                  </View>
                  <View style={styles.riskContent}>
                    <View style={styles.riskTitleRow}>
                      <Text style={styles.riskTitle}>{risk.title}</Text>
                      {risk.severity && (
                        <View
                          style={[
                            styles.severityBadge,
                            { backgroundColor: getSeverityColor(risk.severity) },
                          ]}
                        >
                          <Text style={styles.severityBadgeText}>
                            {risk.severity.toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.riskDescription}>{risk.description}</Text>
                    {risk.category && (
                      <Text style={styles.riskCategory}>Category: {risk.category}</Text>
                    )}
                    {risk.suggestion && (
                      <Text style={styles.riskSuggestion}>💡 {risk.suggestion}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Key Terms */}
          {displayResult.keyTerms.length > 0 && (
            <View style={styles.keyTermsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Key Terms</Text>
                <View style={styles.keyTermsCountBadge}>
                  <Text style={styles.keyTermsCountBadgeText}>
                    {displayResult.keyTerms.length} Items
                  </Text>
                </View>
              </View>
              {displayResult.keyTerms.map((term: KeyTerm, index: number) => (
                <View key={index} style={styles.termItem}>
                  <View style={styles.termHeader}>
                    <Text style={styles.termTitle}>{term.title}</Text>
                    {term.importance && (
                      <View style={styles.importanceBadge}>
                        <Text style={styles.importanceBadgeText}>{term.importance}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.termContent}>{term.content}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Recommendations */}
          {displayResult.recommendations.length > 0 && (
            <View style={styles.recommendationsCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Recommendations</Text>
              </View>
              {displayResult.recommendations.map((recommendation: string, index: number) => (
                <View key={index} style={styles.recommendationItem}>
                  <View style={styles.recommendationBullet}>
                    <Text style={styles.recommendationBulletText}>•</Text>
                  </View>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={clearAnalysis}>
              <LinearGradient
                colors={['#1e293b', '#334155']}
                style={styles.actionButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionButtonText}>
                  {viewSource === 'history' ? 'Re-analyze' : 'Analyze Again'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Timestamp */}
          <Text style={styles.timestamp}>
            {viewSource === 'history' ? 'Analyzed' : 'Completed'} at:{' '}
            {new Date(displayResult.analyzedAt).toLocaleString('en-US')}
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Empty state
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderIcon}>📊</Text>
          <Text style={styles.placeholderText}>No Analysis Yet</Text>
          <Text style={styles.placeholderSubtext}>Take a photo or upload a contract from home</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9', // Cool slate background
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  spinnerWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 32,
  },
  spinnerOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerInner: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerIcon: {
    fontSize: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 13,
    color: '#94a3b8', // Slate 400
  },
  // Progress styles
  progressContainer: {
    width: 200,
    marginTop: 32,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e2e8f0', // Slate 200
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  statusText: {
    marginTop: 12,
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b', // Slate 500
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    overflow: 'hidden',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Card styles - Glass effect
  overviewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  riskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  keyTermsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  recommendationsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  overviewBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  overviewBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#ffffff',
  },
  riskCountBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  riskCountBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#ffffff',
  },
  keyTermsCountBadge: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  keyTermsCountBadgeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#ffffff',
  },
  // Risk Level Card
  riskLevelCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  riskLevelContent: {
    alignItems: 'center',
  },
  riskLevelLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginBottom: 12,
  },
  riskLevelBadge: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  riskLevelBadgeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  // Contract info styles
  summaryText: {
    fontSize: 13,
    color: '#64748b', // Slate 500
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    width: 100,
  },
  infoValue: {
    fontSize: 13,
    color: '#000000',
    flex: 1,
    lineHeight: 20,
  },
  // Risk item styles
  riskItem: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  riskIconWrapper: {
    paddingTop: 2,
  },
  riskIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  riskIconText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  riskContent: {
    flex: 1,
  },
  riskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  riskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    marginRight: 8,
  },
  severityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  severityBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  riskDescription: {
    fontSize: 12,
    color: '#64748b', // Slate 500
    lineHeight: 20,
    marginBottom: 4,
  },
  riskCategory: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    fontStyle: 'italic',
  },
  riskSuggestion: {
    fontSize: 12,
    color: '#1e293b',
    marginTop: 8,
    lineHeight: 18,
  },
  // Key Terms styles
  termItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  termHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  termTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  importanceBadge: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  importanceBadgeText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  termContent: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
  // Recommendations styles
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  recommendationBullet: {
    width: 20,
    paddingTop: 2,
  },
  recommendationBulletText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '700',
  },
  recommendationText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
    flex: 1,
  },
  // Action button styles
  actionButtons: {
    marginVertical: 16,
  },
  actionButton: {
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1e293b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  actionButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8', // Slate 400
    textAlign: 'center',
    marginBottom: 20,
  },
  // Empty state
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  placeholderIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#94a3b8', // Slate 400
  },
  // Source badge styles
  sourceBadgeContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  sourceBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  sourceBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
});
