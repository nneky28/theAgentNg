// @ts-nocheck
'use client'
import { useEffect, useState } from 'react';
import {
  SimpleGrid,
  Card,
  CardBody,
  Icon,
  Stat,
  StatNumber,
  StatLabel,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import {
  FiHome,
  FiBell,
  FiEye,
  FiTrendingUp,
} from 'react-icons/fi';
import { createClient } from '@/utils/supabase/client';

interface StatsData {
  propertiesCount: number;
  notificationsCount: number;
  monthlyViews: number;
  totalViews: number;
}

export const StatsGrid = () => {
  const [stats, setStats] = useState<StatsData>({
    propertiesCount: 0,
    notificationsCount: 0,
    monthlyViews: 0,
    totalViews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    setupRealtimeSubscription();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch properties count
      const { count: propertiesCount } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_email', user.email)
        .eq('is_archived', false);

      // Fetch unread notifications count
      const { count: notificationsCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', user.id)
        .eq('is_read', false);

      // Fetch monthly views (properties viewed in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: monthlyViewsData } = await supabase
        .from('properties')
        .select('views')
        .eq('owner_email', user.email)
        .gte('created_at', thirtyDaysAgo.toISOString());

      const monthlyViews = monthlyViewsData?.reduce((sum, prop) => sum + (prop.views || 0), 0) || 0;

      // Fetch total views (all time)
      const { data: totalViewsData } = await supabase
        .from('properties')
        .select('views')
        .eq('owner_email', user.email);

      const totalViews = totalViewsData?.reduce((sum, prop) => sum + (prop.views || 0), 0) || 0;

      setStats({
        propertiesCount: propertiesCount || 0,
        notificationsCount: notificationsCount || 0,
        monthlyViews,
        totalViews,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const supabase = createClient();
    
    // Subscribe to properties changes
    const propertiesChannel = supabase
      .channel('properties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(propertiesChannel);
      supabase.removeChannel(notificationsChannel);
    };
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" py={10}>
        <Spinner size="lg" color="white" />
      </Flex>
    );
  }

  return (
    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
      <Card 
        bg="rgba(94, 11, 91, 0.1)" 
        backdropFilter="blur(10px)" 
        border="1px solid rgba(255,255,255,0.2)"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', bg: 'rgba(255,255,255,0.15)' }}
      >
        <CardBody textAlign="center">
          <Icon as={FiHome} boxSize={8} mb={2} color="white" />
          <Stat>
            <StatNumber fontSize="2xl" color="white">
              {stats.propertiesCount}
            </StatNumber>
            <StatLabel color="white" opacity={0.8}>
              Properties
            </StatLabel>
          </Stat>
        </CardBody>
      </Card>
      
      <Card 
        bg="rgba(94, 11, 91, 0.1)" 
        backdropFilter="blur(10px)" 
        border="1px solid rgba(255,255,255,0.2)"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', bg: 'rgba(255,255,255,0.15)' }}
      >
        <CardBody textAlign="center">
          <Icon as={FiBell} boxSize={8} mb={2} color="white" />
          <Stat>
            <StatNumber fontSize="2xl" color="white">
              {stats.notificationsCount}
            </StatNumber>
            <StatLabel color="white" opacity={0.8}>
              Notifications
            </StatLabel>
          </Stat>
        </CardBody>
      </Card>
      
      <Card 
        bg="rgba(94, 11, 91, 0.1)" 
        backdropFilter="blur(10px)" 
        border="1px solid rgba(255,255,255,0.2)"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', bg: 'rgba(255,255,255,0.15)' }}
      >
        <CardBody textAlign="center">
          <Icon as={FiEye} boxSize={8} mb={2} color="white" />
          <Stat>
            <StatNumber fontSize="2xl" color="white">
              {stats.monthlyViews}
            </StatNumber>
            <StatLabel color="white" opacity={0.8}>
              Monthly Views
            </StatLabel>
          </Stat>
        </CardBody>
      </Card>
      
      <Card 
        bg="rgba(94, 11, 91, 0.1)" 
        backdropFilter="blur(10px)" 
        border="1px solid rgba(255,255,255,0.2)"
        transition="all 0.3s"
        _hover={{ transform: 'translateY(-4px)', bg: 'rgba(255,255,255,0.15)' }}
      >
        <CardBody textAlign="center">
          <Icon as={FiTrendingUp} boxSize={8} mb={2} color="white" />
          <Stat>
            <StatNumber fontSize="2xl" color="white">
              {stats.totalViews}
            </StatNumber>
            <StatLabel color="white" opacity={0.8}>
              Total Views
            </StatLabel>
          </Stat>
        </CardBody>
      </Card>
    </SimpleGrid>
  );
};